import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../src/Pagination';

describe('Pagination Component', () => {
  const onPageChangeMock = jest.fn();

  beforeEach(() => {
    onPageChangeMock.mockClear();
  });

  test('renders correctly', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChangeMock} />);
    expect(screen.getByText(/Page 1 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Previous/i)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
  });

  test('disables the "Previous" button on the first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChangeMock} />);
    expect(screen.getByText(/Previous/i)).toBeDisabled();
  });

  test('disables the "Next" button on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChangeMock} />);
    expect(screen.getByText(/Next/i)).toBeDisabled();
  });

  test('enables the "Previous" button when not on the first page', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChangeMock} />);
    expect(screen.getByText(/Previous/i)).toBeEnabled();
  });

  test('enables the "Next" button when not on the last page', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChangeMock} />);
    expect(screen.getByText(/Next/i)).toBeEnabled();
  });

  test('calls onPageChange with correct page number when "Previous" button is clicked', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChangeMock} />);
    fireEvent.click(screen.getByText(/Previous/i));
    expect(onPageChangeMock).toHaveBeenCalledWith(1);
  });

  test('calls onPageChange with correct page number when "Next" button is clicked', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChangeMock} />);
    fireEvent.click(screen.getByText(/Next/i));
    expect(onPageChangeMock).toHaveBeenCalledWith(3);
  });
});
