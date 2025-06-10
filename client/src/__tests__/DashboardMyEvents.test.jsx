import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import mockAxios from './__mocks__/axios.js';
import renderWithRouter from './testUtils.jsx';
import { mockUseAuthLoggedInO } from './__mocks__/authContext.js';

/*  == SET UP MOCKS == */
// Replaces Axios by a mock
vi.mock('axios', () => ({
  default: {
    create: () => mockAxios,
    ...mockAxios,
  }
}));

// Replaces AuthProvider
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: () => mockUseAuthLoggedInO,  // Only organizer can see My events page
  };
});

/*  == DRY FUNCTIONS == */
async function getAllMyEventsElements() {
  const createEventButton = await screen.findByRole('button', { name: /create event/i });
  const allMyEventsButton = await screen.findByRole('button', { name: /all my events/i });
  const favorites = await screen.findByRole('button', { name: /favorites/i });
  const img = await screen.findByRole('img', { name: /event1/i });
  const fave = await screen.findByRole('img', { name: /add to favourites/i });
  const dateTimeTitle = await screen.findByText('Date/Time:');
  const cityTitle = await screen.findByText('City:');
  const venueTitle = await screen.findByText('Venue:');
  const genreTitle = await screen.findByText('Genre:');
  const viewEventButton = await screen.findByRole('button', { name: /view event/i });
  const editEventButton = await screen.findByRole('button', { name: /edit event/i });
  const suspended = await screen.findByText('Suspended');

  return {
    sideMenu: [createEventButton, allMyEventsButton, favorites],
    titles: [dateTimeTitle, cityTitle, venueTitle, genreTitle],
    viewEventButton, editEventButton, suspended, img, fave
  }
}

const getToken = () => localStorage.setItem('token', 'fake-jwt-token');

const testYear = new Date().getFullYear() + 1;

/* == TESTS == */
describe(`All My Events when user is organizer`, () => {

  beforeAll(() => getToken())
  afterAll(() => localStorage.clear())
  beforeEach(async () => {
    await waitFor(() => {
      renderWithRouter('/dashboard');
    })

    // Go to all my events
    const allMyEventsButton = await screen.findByRole('button', { name: /all my events/i });
    await userEvent.click(allMyEventsButton);

  })

  it(`All My Events: Side bar, event 1, and edition buttons should appear`, async () => {

    // Check elements
    const { sideMenu, titles, viewEventButton, editEventButton, suspended, img, fave
    } = await getAllMyEventsElements();

    sideMenu.forEach(buttonMenu => expect(buttonMenu).toBeInTheDocument());
    titles.forEach(title => expect(title).toBeInTheDocument());
    [suspended, viewEventButton, editEventButton, img, fave].forEach(element => {
      expect(element).toBeInTheDocument();
    })

  })
  
  it(`All My Events: Event 1 content should appear`, async () => {

    // Check elements
    const title = screen.getByText('Event1')
    const description = screen.getByText('Description 1');
    const dateTime = screen.getByText(`${testYear}-01-01 00:30`);
    const city = screen.getByText('Dublin');
    const venue = screen.getByText('Venue1');
    const genre = screen.getByText('Football');
    // There is no Author here

    [title, description, dateTime, city, venue, genre].forEach(
      content => expect(content).toBeInTheDocument
    )
    
  })

  it(`All my events: Organizer should be able to go to Edit Event`, async () => {

    const { editEventButton } = await getAllMyEventsElements();
    await userEvent.click(editEventButton);

    // Should be in edit page
    const updateEventButton = await screen.findByRole('button', { name: /update event/i });
    expect(updateEventButton).toBeInTheDocument();

  });

  it(`All my events: Organizer should be able to go to Event Detail`, async () => {

    const { viewEventButton } = await getAllMyEventsElements();
    await userEvent.click(viewEventButton);

    // Should be in event detail page
    const goBackButton = await screen.findByRole('button', { name: /go back/i });
    expect(goBackButton).toBeInTheDocument();

  });

  it(`All my events: Organizer should be able to fave their event`, async () => {

    const { fave } = await getAllMyEventsElements();
    await userEvent.click(fave);


    // Face now should be liked
    expect(fave).toHaveAttribute('aria-label', 'Remove from favourites');
  });

});