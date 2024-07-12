import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  useNavigation,
} from "react-router-dom";
import React from "react";

interface Person {
  name: string;
  url: string;
}

interface LoaderData {
  people: Person[];
}

export async function loader() {
  const response = await fetch('https://swapi.dev/api/people/');
  const data = await response.json();
  return { people: data.results };
}

export default function Root() {
  const { people } = useLoaderData() as LoaderData;
  const navigation = useNavigation();
  return (
    <>
      <div id="sidebar">
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search people"
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
          {people.length ? (
            <ul>
              {people.map((person, index) => (
                <li key={index}>
                  <NavLink
                    to={`people/${index + 1}`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }>
                    {person.name || <i>No Name</i>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No people</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
        <Outlet />
      </div>
    </>
  );
}
