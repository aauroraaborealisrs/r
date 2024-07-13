import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CardList from '../src/components/CardList';
import { Person } from '../src/interfaces';

const mockPeople: Person[] = [
  { name: 'Luke Skywalker', height: '172', mass: '77', hair_color: 'blond', skin_color: 'fair', eye_color: 'blue', birth_year: '19BBY', gender: 'male' },
  { name: 'Darth Vader', height: '202', mass: '136', hair_color: 'none', skin_color: 'white', eye_color: 'yellow', birth_year: '41.9BBY', gender: 'male' },
];

describe('CardList Component', () => {
  test('renders the specified number of cards', () => {
    render(
      <MemoryRouter>
        <CardList people={mockPeople} searchQuery="" currentPage={1} />
      </MemoryRouter>
    );
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  test('displays an appropriate message if no cards are present', () => {
    render(
      <MemoryRouter>
        <CardList people={[]} searchQuery="" currentPage={1} />
      </MemoryRouter>
    );
    expect(screen.getByText(/No cards available/i)).toBeInTheDocument();
  });
});
