import { Form, useLoaderData } from "react-router-dom";
import { getContact } from "../contacts";
import React from "react";

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  return { contact };
}

interface LoaderData {
  contact: {
    id: string; 
    avatar?: string;
    first?: string;
    last?: string;
    notes?: string;
  };
}

export default function Contact() {
  const { contact } = useLoaderData() as LoaderData;

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={
            contact.avatar ||
            `https://robohash.org/${contact.id}.png?size=200x200`
          }
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
        </h1>

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
        </div>
      </div>
    </div>
  );
}