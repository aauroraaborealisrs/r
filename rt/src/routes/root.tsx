import {
    Outlet,
    NavLink,
    useLoaderData,
    Form,
    redirect,
    useNavigation,
  } from "react-router-dom";
import { getContacts } from "../contacts";
import React from "react";

export async function loader() {
    const contacts = await getContacts();
    return { contacts };
  }

  interface LoaderData {
    contact: {
      id: string; 
      avatar?: string;
      first?: string;
      last?: string;
      notes?: string;
    };
    contacts: {
      id: string; 
      avatar?: string;
      first?: string;
      last?: string;
      notes?: string;
    }[];
  }

export default function Root() {
  const { contact, contacts } = useLoaderData() as LoaderData;
      const navigation = useNavigation();
    return (
      <>
        <div id="sidebar">
          <div>
            <form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={true}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </form>
          </div>
          <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                   <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
          </nav>
        </div>
        <div id="detail" className={
          navigation.state === "loading" ? "loading" : ""
        }>
        <Outlet />
      </div>
      </>
    );
  }