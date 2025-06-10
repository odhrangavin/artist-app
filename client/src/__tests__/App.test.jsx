import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, test } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import mockAxios from './__mocks__/axios.js';

import { AuthProvider } from '../context/AuthContext.jsx';
import renderWithRouter from './testUtils.jsx';
import App from '../App';
import {
  mockUseAuthLoggedInO, mockUseAuthLoggedInA,
  mockUseAuthNotLoggedIn, mockLogout
} from './__mocks__/authContext.js';

/*  == DRY FUNCTIONS == */

/*  == SET UP MOCKS == */
// Replaces Axios by a mock
vi.mock('axios', () => ({
  default: {
    create: () => mockAxios,
    ...mockAxios,
  }
}));

// Replaces AuthProvider
let currentMock = mockUseAuthNotLoggedIn;
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: () => currentMock,
  };
});

const getToken = () => localStorage.setItem('token', 'fake-jwt-token');

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
  afterEach(() => {
    // Clean mocks so other tests that requrie user not logged in can pass
    currentMock = mockUseAuthNotLoggedIn;
    localStorage.clear();
  });
  it('should render login page at /login', () => {
    renderWithRouter('/login')

    const button = screen.getByRole('button', { name: /log in/i });
    expect(button).toBeInTheDocument();
  });
  it('should render register page at /register', () => {
    renderWithRouter('/register')

    const button = screen.getByRole('button', { name: /register/i });
    expect(button).toBeInTheDocument();
  });
  it('should render dashboard page for organizer at /dashboard', async () => {
    currentMock = mockUseAuthLoggedInO;
    getToken(); // Set token to have access

    renderWithRouter('/dashboard')

    await waitFor(() => {
      expect(screen.getByText(/create your event/i)).toBeInTheDocument();
    })
  });
  it('should render dashboard page (favourites) for attendee at /dashboard', async () => {
    currentMock = mockUseAuthLoggedInA;
    getToken(); // Set token to have access

    renderWithRouter('/dashboard')

    await waitFor(() => {
      expect(screen.queryByText(/create your event/i)).not.toBeInTheDocument();
      expect(screen.getByText(/my favourite events/i)).toBeInTheDocument();
    })
  });
  it('should not render dashboard page at /register and redirect to log in instead ', () => {
    renderWithRouter('/dashboard') // User not logged in

    const button = screen.getByRole('button', { name: /log in/i });
    expect(button).toBeInTheDocument();
  });
  it('should render forgot-password page at /forgot-password', async () => {
    renderWithRouter('/forgot-password')

    const button = screen.getByRole('button', { name: /request reset/i });

    await waitFor(() => {
      expect(button).toBeInTheDocument();
    });
  });
  it('should render reset-password page at /reset-password', async () => {
    renderWithRouter('/reset-password')

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /confirm reset/i });
      expect(button).toBeInTheDocument();
    });
  });
  it('should render a particular event at /events/:id', async () => {
    renderWithRouter('/events/1')

    const eventContainer = await screen.findByRole('region', { name: 'Event detail' });
    expect(eventContainer).toBeInTheDocument();
  });
  it('should render a 404 not found at any wrong page', async () => {
    renderWithRouter('/pagewithtypo')

    await waitFor(() => {
      expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
    });
  });
});

// Test navigation in app renders correctly
describe('App Navigation when user is not logged in', () => {
  it('should navigate to Log in section and render it', async () => {
    renderWithRouter()

    const loginLink = screen.getByRole('link', { name: /log in/i });
    await userEvent.click(loginLink);

    const button = await screen.findByRole('button', { name: /log in/i });
    expect(button).toBeInTheDocument();
  });
  it('should navigate to Register section and render it', async () => {
    renderWithRouter()

    const registerLink = screen.getAllByRole('link', { name: /register/i });
    await userEvent.click(registerLink[0]);

    const button = await screen.findByRole('button', { name: /register/i });
    expect(button).toBeInTheDocument();
  });
  it('should navigate back to Home section and render it', async () => {
    renderWithRouter('/login')

    const homeLink = screen.getByRole('link', { name: /home/i });
    await userEvent.click(homeLink);

    expect(await screen.findByText('Welcome to Event App')).toBeInTheDocument();
  });

  it('should not render dashboard tab and logout button in navigation', async () => {
    renderWithRouter()

    const dashboardLink = screen.queryByRole('link', { name: /dashboard/i });
    const logoutButton = screen.queryByRole('button', { name: /logout/i });

    await waitFor(() => {
      expect(dashboardLink).not.toBeInTheDocument();
      expect(logoutButton).not.toBeInTheDocument();
    });

  });

});

describe('App Navigation when user is logged in', () => {
  // Create user mock
  beforeEach(() => {
    currentMock = mockUseAuthLoggedInO;
    getToken();
  });

  it('should not render login and register tabs ', async () => {
    renderWithRouter()

    const loginLink = screen.queryByRole('link', { name: /log in/i });
    const registerLink = screen.queryByRole('link', { name: /register/i });

    await waitFor(() => {
      expect(loginLink).not.toBeInTheDocument();
      expect(registerLink).not.toBeInTheDocument();
    });

  });

  it('should navigate to Dashboard section and render it', async () => {
    renderWithRouter()

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    await userEvent.click(dashboardLink);

    expect(await screen.findByText(/create your event/i)).toBeInTheDocument();
  });

  it('should log out the user when click on Logout', async () => {
    renderWithRouter()

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await userEvent.click(logoutButton);

    // Check that lockout function was called
    expect(mockLogout).toHaveBeenCalled();
  });

});