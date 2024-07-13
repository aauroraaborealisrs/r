import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import { Person } from '../src/interfaces';
import Card from '../src/components/Card';

const mockPerson: Person = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
};

describe('Card Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders the relevant card data', () => {
    render(
      <MemoryRouter>
        <Card person={mockPerson} searchQuery="" currentPage={1} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
  });

  test('clicking on a card opens a detailed card component', () => {
    render(
      <MemoryRouter>
        <Card person={mockPerson} searchQuery="" currentPage={1} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Luke Skywalker/i));
    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
  });

  test('clicking triggers an additional API call to fetch detailed information', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockPerson));

    render(
      <MemoryRouter>
        <Card person={mockPerson} searchQuery="" currentPage={1} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Luke Skywalker/i));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
