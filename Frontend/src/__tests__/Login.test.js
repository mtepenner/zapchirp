import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock the AuthContext if your Login component relies on a global context provider
jest.mock('../context/AuthContext', () => ({
  useAuthContext: () => ({ setAuthUser: jest.fn() })
}));

describe('Login Component', () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('renders the login form correctly', () => {
    renderWithRouter(<Login />);
    
    // Check for headings and inputs
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('updates input values when the user types', () => {
    renderWithRouter(<Login />);
    
    const usernameInput = screen.getByPlaceholderText(/Enter username/i);
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);

    fireEvent.change(usernameInput, { target: { value: 'cooluser' } });
    fireEvent.change(passwordInput, { target: { value: 'securepass' } });

    expect(usernameInput.value).toBe('cooluser');
    expect(passwordInput.value).toBe('securepass');
  });
});
