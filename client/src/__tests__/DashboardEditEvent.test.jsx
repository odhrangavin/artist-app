import { screen } from '@testing-library/react';
import { describe, it, expect, test, beforeEach, beforeAll, afterAll } from 'vitest';
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
    useAuth: () => mockUseAuthLoggedInO,  // Only organizer can see Create event page
  };
});

/*  == DRY FUNCTIONS == */
async function getEditEventElements() {

  const buttonCreateEvent = await screen.findByRole('button', { name: /create event/i });
  const allMyEventsButton = await screen.findByRole('button', { name: /all my events/i });
  const favourites = await screen.findByRole('button', { name: /favourites/i });
  const pageHeader = await screen.findByText(/edit event/i);
  const eventImg = await screen.findAllByRole('img', { name: /Event1/i }); // Edit and preview img
  const fieldTitle = await screen.findByRole('textbox', { name: /title/i });
  const fieldImgUrl = await screen.findByRole('textbox', { name: /image url/i }); // upload file?
  // const fieldImgUpload = await screen.findByLabelText(/or upload image/i);
  const fieldDateTime = await screen.findByLabelText(/date & time/i);
  const fieldLocation = await screen.findByRole('textbox', { name: /location/i });
  const fieldVenue = await screen.findByRole('textbox', { name: /venue/i });
  const fieldGenre = await screen.findByRole('combobox', { name: /genre/i });
  const fieldDescription = await screen.findByRole('textbox', { name: /description/i });
  const buttonUpdateEvent = await screen.findByRole('button', { name: /update event/i });
  const buttonUnsuspendEvent = await screen.findByRole('button', { name: /unsuspend event/i });
  const buttonBackToMyEvent = await screen.findByRole('button', { name: /back to my events/i });

  return {
    sideMenu: [buttonCreateEvent, allMyEventsButton, favourites],
    pageHeader, eventImg, fieldTitle, fieldImgUrl, fieldDateTime,
    fieldLocation, fieldVenue, fieldGenre, fieldDescription, buttonUpdateEvent,
    buttonUnsuspendEvent, buttonBackToMyEvent
  }
}

const getToken = () => localStorage.setItem('token', 'fake-jwt-token');

/* == TESTS == */
describe(`Create Event when user is organizer`, () => {

  beforeAll(() => getToken())
  afterAll(() => localStorage.clear())
  beforeEach(async () => {
    renderWithRouter('/dashboard');

    // Go to all my events
    const allMyEventsButton = await screen.findByRole('button', { name: /all my events/i });
    await userEvent.click(allMyEventsButton);

    // Go to edit event
    const editEventButton = await screen.findByRole('button', { name: /edit event/i });
    await userEvent.click(editEventButton);

  })


  it(`Edit Event: Side bar, create event fields and button should appear`, async () => {

    const { sideMenu, pageHeader, eventImg, fieldTitle, fieldImgUrl, fieldDateTime,
      fieldLocation, fieldVenue, fieldGenre, fieldDescription, buttonUpdateEvent,
      buttonUnsuspendEvent, buttonBackToMyEvent
    } = await getEditEventElements();

    // Check elements
    sideMenu.forEach(buttonMenu => expect(buttonMenu).toBeInTheDocument());
    expect(pageHeader).toBeInTheDocument();
    expect(eventImg).toHaveLength(1);
    [fieldTitle, fieldImgUrl, fieldDateTime, fieldLocation, fieldVenue,
      fieldGenre, fieldDescription].forEach(field => {
        expect(field).toBeInTheDocument();
      });
    [buttonUpdateEvent, buttonUnsuspendEvent, buttonBackToMyEvent].forEach(button => {
      expect(button).toBeInTheDocument();
    })

  })

  // Tests left: Check initial values, test data validation, test submition

});