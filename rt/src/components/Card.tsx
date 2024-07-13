import React from 'react';
import { NavLink } from 'react-router-dom';
import { Person } from '../interfaces';

interface CardProps {
  person: Person;
  searchQuery: string;
  currentPage: number;
}

const Card: React.FC<CardProps> = ({ person, searchQuery, currentPage }) => {
  const handleClick = async () => {
    try {
      const response = await fetch(`https://swapi.dev/api/people/?search=${person.name}`);
      const data = await response.json();
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  return (
    <NavLink
      key={person.name}
      to={`/?search=${searchQuery}&page=${currentPage}&details=${encodeURIComponent(person.name)}`}
      className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}
      onClick={handleClick}
    >
      {person.name}
    </NavLink>
  );
};

export default Card;
