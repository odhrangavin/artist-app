import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import mockAxios from './axios';

import { AuthProvider } from '../context/AuthContext.jsx';
import renderWithRouter from './testUtils.jsx';
import App from '../App';

/*  == DRY FUNCTIONS == */

/*  == SET UP MOCKS == */
// Replaces Axios by a mock
vi.mock('axios', () => ({
  default: {
    create: () => mockAxios,
    ...mockAxios,
  }
})); 


/* == TESTS == */

// Test App.jsx renders correctly
describe('App screen', () => {
  it('should render index at /', async () => {
    render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    );
    expect(await screen.findByText('Welcome to Event App')).toBeInTheDocument()
  });
});

// Test routes in app render correctly
describe('App Routing', () => {
  it('should render login page at /login', () => {   
    renderWithRouter('/login')

    const button = screen.getByRole('button', { name:/log in/i});
    expect(button).toBeInTheDocument();
  });
  it('should render register page at /register', () => {
    renderWithRouter('/register')

    const button = screen.getByRole('button', { name:/register/i});
    expect(button).toBeInTheDocument();
  });
  it('should render dashboard page at /dashboard', () => {
    renderWithRouter('/dashboard')

    expect(screen.getByText('Welcome to your Dashboard')).toBeInTheDocument();
  });
});

// Test navigation in app renders correctly
describe('App Navigation', () => {
  it('should navigate to Log in section and render it', async () => {
    renderWithRouter()

    const loginLink = screen.getByRole('link', { name: /log in/i });
    await userEvent.click(loginLink);
    
    const button = await screen.findByRole('button', { name:/log in/i});
    expect(button).toBeInTheDocument();
  });
  it('should navigate to Register section and render it', async () => {
    renderWithRouter()

    const registerLink = screen.getByRole('link', { name: /register/i });
    await userEvent.click(registerLink);
    
    const button = await screen.findByRole('button', { name:/register/i});
    expect(button).toBeInTheDocument();
  });
  it('should navigate to Dashboard section and render it', async () => {
    renderWithRouter()

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    await userEvent.click(dashboardLink);
    
    expect(await screen.findByText('Welcome to your Dashboard')).toBeInTheDocument();
  });
  it('should navigate back to Home section and render it', async () => {
    renderWithRouter('/login')

    const homeLink = screen.getByRole('link', { name: /home/i });
    await userEvent.click(homeLink);
    
    expect(await screen.findByText('Welcome to Event App')).toBeInTheDocument();
  });

});