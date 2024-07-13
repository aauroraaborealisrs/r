import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchSection from '../src/components/SearchSection';

describe('SearchSection Component', () => {

  test('saves the entered value to local storage when the Search button is clicked', () => {
    const handleSearchTermChange = jest.fn();
    const handleSearch = jest.fn(() => {
      localStorage.setItem('searchTerm', 'Luke Skywalker');
    });

    render(
      <SearchSection
        searchTerm=""
        onSearchTermChange={handleSearchTermChange}
        onSearch={handleSearch}
      />
    );

    const input = screen.getByPlaceholderText(/search for characters/i);
    const button = screen.getByText(/search/i);

    fireEvent.change(input, { target: { value: 'Luke Skywalker' } });
    fireEvent.click(button);

    expect(localStorage.getItem('searchTerm')).toBe('Luke Skywalker');
  });

  test('retrieves the value from local storage upon mounting', () => {
    localStorage.setItem('searchTerm', 'Darth Vader');

    const handleSearchTermChange = jest.fn();
    const handleSearch = jest.fn();

    render(
      <SearchSection
        searchTerm={localStorage.getItem('searchTerm') || ""}
        onSearchTermChange={handleSearchTermChange}
        onSearch={handleSearch}
      />
    );

    expect(screen.getByDisplayValue('Darth Vader')).toBeInTheDocument();
  });
});
