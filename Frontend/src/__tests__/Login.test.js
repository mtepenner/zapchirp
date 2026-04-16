import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

describe('Login Component', () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('renders the login form correctly', () => {
    renderWithRouter(<Login setLoggedIn={jest.fn()} setToken={jest.fn()} setUsername={jest.fn()} />);
    
    // Check for headings and inputs
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('updates input values when the user types', () => {
    renderWithRouter(<Login setLoggedIn={jest.fn()} setToken={jest.fn()} setUsername={jest.fn()} />);
    
    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);

    fireEvent.change(usernameInput, { target: { value: 'cooluser' } });
    fireEvent.change(passwordInput, { target: { value: 'securepass' } });

    expect(usernameInput.value).toBe('cooluser');
    expect(passwordInput.value).toBe('securepass');
  });
});
