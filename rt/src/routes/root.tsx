import {
  Outlet,
  NavLink,
  useLoaderData,
  useLocation,
  useNavigation,
} from "react-router-dom";
import React, { useState, useEffect, FormEvent } from "react";
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
  const [showContact, setShowContact] = useState(true); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);

  useEffect(() => {
    if (location.pathname === '/' || location.pathname.startsWith('/people')) {
      setShowContact(true);
    } else {
      setShowContact(false);
    }
  }, [location]);

  useEffect(() => {
    setFilteredPeople(
      people.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, people]);

  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    const searchQuery = event.target.value.trim();
    if (searchQuery) {
      const response = await fetch(`https://swapi.dev/api/people/?search=${searchQuery}`);
      if (!response.ok) {
        throw new Response("Failed to fetch data", { status: 500 });
      }
      const data = await response.json();
      setFilteredPeople(data.results);
    } else {
      setFilteredPeople(people);
    }
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  if (!people) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div id="sidebar">
        <div>
          <form id="search-form" role="search" onSubmit={handleSearchSubmit}>
            <input
              id="q"
              aria-label="Search people"
              placeholder="Search"
              type="search"
              name="q"
              value={searchTerm}
              onChange={handleSearchChange}
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
          {filteredPeople.length ? (
            <ul>
              {filteredPeople.map((person, index) => (
                <li key={person.name}>
                  <NavLink
                    to={`people/${encodeURIComponent(person.name)}`}
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
              <i>No people found</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
        {showContact ? (
          <>
            <Outlet />
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
