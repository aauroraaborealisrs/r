import React, { useEffect, useState } from "react";
import { Person } from "../interfaces";

interface ProfilePageProps {
  name: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ name }) => {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://swapi.dev/api/people/?search=${name}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPerson(data.results[0] || null);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!person) {
    return <div>No data available</div>;
  }

  return (
    <div className="profile-page">
      <h1>{person.name}</h1>
      <p>Height: {person.height} cm</p>
      <p>Mass: {person.mass} kg</p>
      <p>Hair Color: {person.hair_color}</p>
      <p>Skin Color: {person.skin_color}</p>
      <p>Eye Color: {person.eye_color}</p>
      <p>Birth Year: {person.birth_year}</p>
      <p>Gender: {person.gender}</p>
    </div>
  );
};

export default ProfilePage;
