import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ProfilePage from '../src/components/ProfilePage';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        results: [
          {
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male',
          },
        ],
      }),
  })
) as jest.Mock;

describe('ProfilePage Component', () => {
  test('displays a loading indicator while fetching data', () => {
    render(<ProfilePage name="Luke Skywalker" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('correctly displays the detailed card data', async () => {
    await act(async () => {
      render(<ProfilePage name="Luke Skywalker" />);
    });

    expect(await screen.findByText(/luke skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/height: 172 cm/i)).toBeInTheDocument();
    expect(screen.getByText(/mass: 77 kg/i)).toBeInTheDocument();
    expect(screen.getByText(/hair color: blond/i)).toBeInTheDocument();
    expect(screen.getByText(/skin color: fair/i)).toBeInTheDocument();
    expect(screen.getByText(/eye color: blue/i)).toBeInTheDocument();
    expect(screen.getByText(/birth year: 19bby/i)).toBeInTheDocument();
    expect(screen.getByText(/gender: male/i)).toBeInTheDocument();
  });
});
