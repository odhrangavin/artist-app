import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';

import App from '../App';

// Test App.jsx renders correctly
describe('App screen', () => {
  it('renders without crashing', () => {
    render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    );
    expect(screen.getByText('Welcome to Event App')).toBeInTheDocument()
  });
});

describe('App Routing', () => {
  it('renders dashboard route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    // Expect an element that's unique to the login page
    expect(screen.getByText(/log in/i)).toBeInTheDocument(); // puede ser el título o un botón
  });
});