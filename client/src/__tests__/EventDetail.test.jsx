import { findByRole, render, screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, test, beforeEach } from 'vitest';
import { BrowserRouter, Link } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import mockAxios, { currentUser } from './__mocks__/axios.js';
import API from '../api/api.js'
import { AuthProvider } from '../context/AuthContext.jsx';
import renderWithRouter from './testUtils.jsx';
import App from '../App.jsx';
import { mockUseAuthLoggedInO, mockUseAuthLoggedInA, 
  mockUseAuthNotLoggedIn, mockLogout } from './__mocks__/authContext.js';
import { act } from 'react';

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

/*  == DRY FUNCTIONS == */
async function getEventDetailElements() {
  
      const dateTimeTitle = await screen.findByText('Date/Time:');
      const cityTitle = await screen.findByText('City:');
      const venueTitle = await screen.findByText('Venue:');
      const genreTitle = await screen.findByText('Genre:');
      const authorTitle = await screen.findByText('Author:');
      const goBackButton = await screen.findByRole('button', {name: /Go Back/i})
      
  
  return {
    titles: [dateTimeTitle, cityTitle, venueTitle, genreTitle, authorTitle], 
    goBackButton,
  }
  
}

async function getOptionalEventDetailElements() {
  
  const region = await screen.findByRole('region', {name: /event detail/i});
  const eventImg = within(region).queryByRole('img', {name: /^event.+/i});
  const defaultImg = within(region).queryByRole('img', {name: /event image/i});
  const descriptionTitle = screen.queryByText(/Description:/i);
  const suspended = screen.queryByText('Suspended');
  
  return { descriptionTitle, eventImg, defaultImg, suspended };
  
}




const getToken = () => localStorage.setItem('token', 'fake-jwt-token');

/* == TESTS == */
describe(`Event Detail when user is not logged in`, () => {


  it(`Event 1 detail shows description, date/time, city, venue, genre, authon, and
    go back button when user not logged in`, async () => {

    await waitFor(() => {
      renderWithRouter('/events/1');
    })

    const { titles, goBackButton } = await getEventDetailElements();
    const { descriptionTitle, eventImg, suspended } = await getOptionalEventDetailElements();

    titles.forEach(title => expect(title).toBeInTheDocument());
    expect(descriptionTitle).toBeInTheDocument(); // Event 1 has a description
    expect(eventImg).toBeInTheDocument(); // Event 1 has a picture
    expect(suspended).toBeInTheDocument();
    expect(goBackButton).toBeInTheDocument();
  })

  it(`Event 1 detail shows content`, async () => {
    await waitFor(() => {
      renderWithRouter('/events/1');
    })

    const title = screen.getByText('Event1');
    const description = screen.getByText('Description 1');
    const dateTime = screen.getByText('2026-01-01 00:30');
    const city = screen.getByText('Dublin');
    const venue = screen.getByText('Venue1');
    const genre = screen.getByText('Football');
    const author = await screen.findByText('usertest'); // It goes through some useStates

    [title, description, dateTime, city, venue, genre, author].forEach(
      content => expect(content).toBeInTheDocument
    )
  });

  it(`Event 1 detail shows that no one is attending`, async () => {
    await waitFor(() => {
      renderWithRouter('/events/1');
    })

    const attendance = await screen.findByText(/Be the first Event App user to join this event!/i);
    
    expect(attendance).toBeInTheDocument();

  });


});

