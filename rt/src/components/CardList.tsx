import React from 'react';
import { NavLink } from 'react-router-dom';
import { Person } from '../interfaces';

interface CardListProps {
  people: Person[];
  searchQuery: string;
  currentPage: number;
}

const CardList: React.FC<CardListProps> = ({ people, searchQuery, currentPage }) => {
  return (
    <div className="results-section">
      {people.length === 0 ? (
        <p>No cards available</p>
      ) : (
        <div className="results-cont">
          <div className="results-names">
            {people.map((person) => (
              <NavLink
                key={person.name}
                to={`/?search=${searchQuery}&page=${currentPage}&details=${encodeURIComponent(person.name)}`}
                className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}
              >
                {person.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardList;
