import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import ProfilePage from '../src/components/ProfilePage';

const mockFetch = jest.spyOn(global, 'fetch').mockImplementation((input: RequestInfo | URL, init?: RequestInit) =>
  new Promise<Response>((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
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
      } as unknown as Response);
    }, 100);
  })
);

describe('ProfilePage Component', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  test('displays a loading indicator while fetching data', async () => {
    await act(async () => {
      render(<ProfilePage name="Luke Skywalker" />);
    });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  test('correctly displays the detailed card data', async () => {
    await act(async () => {
      render(<ProfilePage name="Luke Skywalker" />);
    });

    await waitFor(() => {
      expect(screen.getByText(/luke skywalker/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/height: 172 cm/i)).toBeInTheDocument();
    expect(screen.getByText(/mass: 77 kg/i)).toBeInTheDocument();
    expect(screen.getByText(/hair color: blond/i)).toBeInTheDocument();
    expect(screen.getByText(/skin color: fair/i)).toBeInTheDocument();
    expect(screen.getByText(/eye color: blue/i)).toBeInTheDocument();
    expect(screen.getByText(/birth year: 19bby/i)).toBeInTheDocument();
    expect(screen.getByText(/gender: male/i)).toBeInTheDocument();
  });

  test('displays an error message when fetch fails', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network response was not ok'))
    );

    await act(async () => {
      render(<ProfilePage name="Luke Skywalker" />);
    });

    await waitFor(() => {
      expect(screen.getByText(/error: network response was not ok/i)).toBeInTheDocument();
    });
  });

  test('displays a "No data available" message when no person is found', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve({ results: [] }),
      } as unknown as Response)
    );

    await act(async () => {
      render(<ProfilePage name="Unknown" />);
    });

    await waitFor(() => {
      expect(screen.getByText(/no data available/i)).toBeInTheDocument();
    });
  });
});
