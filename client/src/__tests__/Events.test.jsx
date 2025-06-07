import { findByRole, render, screen, waitFor } from '@testing-library/react';
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
async function getHomeElements() {
  
  const buttonLogin = screen.getByRole('link', {name: /log in/i}); // Login in navbar
  const buttonSearch = screen.getByRole('button', {name: /search/i});
  const buttonClear = screen.getByRole('button', {name: /Clear/i});
  const selectGenre = await screen.findByRole('combobox', {name: /select a genre/i})
  const event1 = await screen.findByText(/event1/i);
  const event2 = await screen.findByText(/event2/i);
  const event3 = await screen.findByText(/event3/i);
  const allEvents = await screen.findAllByText(/^event\d+$/i);
  const viewEventLinks = await screen.findAllByRole('link', {name: /view event/i});
  // If not logged, this elements should not appear:
  const buttonFave = screen.queryByRole('img', {name: /fave-button/i})
  const buttonAttend = screen.queryByRole('button', {name: /cancel attendance/i})

  return {
    buttonLogin, buttonSearch, buttonClear, event1, event2, event3, allEvents, 
    viewEventLinks, buttonFave, buttonAttend, selectGenre
  }
  
}

const getToken = () => localStorage.setItem('token', 'fake-jwt-token');

/* == TESTS == */
describe('Events in Home page user not logged in', () => {

  it('User not logged in should only see the events and detail', async () => {
    renderWithRouter();

    // Get page elements
    const {
      buttonLogin, buttonSearch, buttonClear, event1, event2, event3, allEvents, 
      viewEventLinks, buttonFave, buttonAttend
    } = await getHomeElements();

 
    // Do assertions
    for (let buttonElement of [buttonLogin, buttonSearch, buttonClear]) {
      expect(buttonElement).toBeInTheDocument();
    } 
    for (let event of [event1, event2, event3]) {
      expect(event).toBeInTheDocument();
    } 
    expect(allEvents).toHaveLength(3);
    expect(viewEventLinks).toHaveLength(3);
    expect(buttonFave).not.toBeInTheDocument();
    expect(buttonAttend).not.toBeInTheDocument();

  })
  it('User not logged in should be able to go to event detail', async () => {
    renderWithRouter();

    const { viewEventLinks } = await getHomeElements();

    await userEvent.click(viewEventLinks[0]);

    // Event detail has a go back button
    waitFor(() => {
      const buttonGoBack = screen.getByRole('button', {name: /go back/i});
      expect(buttonGoBack).toBeInTheDocument();
    })
    
    
  }) 
  it('User not logged in should be able to filter events', async () => {
    renderWithRouter();

    const { selectGenre, buttonClear, buttonSearch } = await getHomeElements();

    // Select a genre and check value
    await userEvent.selectOptions(selectGenre, 'Football');
    expect(selectGenre.value).toBe('Football');

    // Search genre and check events and value
    await userEvent.click(buttonSearch);
    let events = await screen.findAllByText(/^event\d+$/i);
    
    expect(selectGenre.value).toBe('Football');
    expect(events).toHaveLength(2);

    // Clear filter and check event and value
    await userEvent.click(buttonClear);
    events = await screen.findAllByText(/^event\d+$/i);

    expect(selectGenre.value).toBe('');
    expect(events).toHaveLength(3);
    
  })
})