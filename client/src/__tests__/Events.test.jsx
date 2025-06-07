import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, test } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import mockAxios from './__mocks__/axios.js';

import { AuthProvider } from '../context/AuthContext.jsx';
import renderWithRouter from './testUtils.jsx';
import App from '../App.jsx';
import { mockUseAuthLoggedInO, mockUseAuthLoggedInA, 
  mockUseAuthNotLoggedIn, mockLogout } from './__mocks__/authContext.js';

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
function getHomeElements() {
  const buttonLogin = screen.getByRole('link', {name: /log in/i}); // Login in navbar
  const searchButton = screen.getByRole('button', {name: /search/i});
  const clearButton = screen.getByRole('button', {name: /Clear/i});
  const event1 = screen.getByText(/event1/i);
  const event2 = screen.getByText(/event2/i);
  const event3 = screen.getByText(/event3/i);
  const allEvents = screen.getAllByText(/^event\d+$/i);
  const viewEventLinks = screen.getAllByRole('link', {name: /view event/i});
  // If not logged, this elements should not appear:
  const faveButton = screen.queryByRole('img', {name: /fave-button/i})
  const attendButton = screen.queryByRole('button', {name: /cancel attendance/i})

  return {
    buttonLogin, searchButton, clearButton, event1, event2, event3, allEvents, 
    viewEventLinks, faveButton, attendButton
  }
  
}

const getToken = () => localStorage.setItem('token', 'fake-jwt-token');

/* == TESTS == */
describe('Events in Home page user not logged in', () => {

  it('User not logged in should only see the events and detail', async () => {
    renderWithRouter();

    await waitFor (() => {
      // Get page elements
      const {
        buttonLogin, searchButton, clearButton, event1, event2, event3, allEvents, 
        viewEventLinks, faveButton, attendButton
      } = getHomeElements();

      // Do assertions
      for (let buttonElement of [buttonLogin, searchButton, clearButton]) {
        expect(buttonElement).toBeInTheDocument();
      } 
      for (let event of [event1, event2, event3]) {
        expect(event).toBeInTheDocument();
      } 
      expect(viewEventLinks).toHaveLength(3);
      expect(faveButton).not.toBeInTheDocument();
      expect(attendButton).not.toBeInTheDocument();
      // Events should be sorted in descending order by date and time
      expect(allEvents[0]).toHaveTextContent('Event2');
      expect(allEvents[1]).toHaveTextContent('Event1');
      expect(allEvents[2]).toHaveTextContent('Event3');
    }) 
  })
  it('User not logged in should be able to go to event detail', async () => {
    renderWithRouter();

    const {} = getHomeElements()

    await waitFor (() => {
      
    }) 
  })
  it('User not logged in should be able to filter events', async () => {
    renderWithRouter();

    await waitFor (() => {
      
    }) 
  })
  

  


})