import {
  Outlet,
  NavLink,
  useLoaderData,
  useLocation,
  useNavigation
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import Index from "./index";

interface Person {
  name: string;
  url: string;
}

interface LoaderData {
  people: Person[];
}

export async function loader() {
  const response = await fetch('https://swapi.dev/api/people/');
  if (!response.ok) {
    throw new Response("Failed to fetch data", { status: 500 });
  }
  const data = await response.json();
  return { people: data.results };
}

export default function Root() {
  const { people } = useLoaderData() as LoaderData;
  const location = useLocation();
  const navigation = useNavigation();
  const [showContact, setShowContact] = useState(true); // Состояние для управления видимостью

  useEffect(() => {
    // Показываем Index, если путь соответствует / и не содержит contactId
    if (location.pathname === '/' || location.pathname.startsWith('/people')) {
      setShowContact(true);
    } else {
      setShowContact(false);
    }
  }, [location]);

  if (!people) {
    return <div>Loading...</div>;
  }

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
        {/* Показываем `Contact` если `showContact` равно true, иначе показываем `Index` */}
        {showContact ? (
          <>
            <Outlet />
            {/* Показываем кнопку `Edit`, если путь содержит контакт */}
            {location.pathname.startsWith('/people/') && (
              <button onClick={() => setShowContact(false)}>Edit</button>
            )}
          </>
        ) : (
          <Index />
        )}
      </div>
    </>
  );
}
