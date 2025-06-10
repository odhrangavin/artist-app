import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { vi } from 'vitest';
import mockAxios from './__mocks__/axios.js';
import renderWithRouter from './testUtils.jsx';;
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
async function getCreateEventElements() {

  const allMyEventsButton = await screen.findByRole('button', {name: /all my events/i});
  const favorites = await screen.findByRole('button', {name: /favorites/i});
  const pageHeader = screen.getByText(/create your event/i)
  const fieldTitle = await screen.findByRole('textbox', {name: /title/i});
  const fieldImgUrl = await screen.findByRole('textbox', {name: /image url/i});
  const fieldImgUpload = await screen.findByLabelText(/or upload image/i);
  const fieldDateTime = await screen.findByLabelText(/date & time/i);
  const fieldLocation = await screen.findByRole('textbox', {name: /location/i});
  const fieldVenue = await screen.findByRole('textbox', {name: /venue/i});
  const fieldGenre = await screen.findByRole('combobox', {name: /genre/i});
  const fieldDescription = await screen.findByRole('textbox', {name: /description/i});
  const buttonsCreateEvent = await screen.findAllByRole('button', {name: /create event/i});
  
  return {
    sideMenu: [allMyEventsButton, favorites],
    pageHeader, fieldTitle, fieldImgUrl, fieldImgUpload, fieldDateTime,
    fieldLocation, fieldVenue, fieldGenre, fieldDescription, buttonsCreateEvent
  }
}

const getToken = () => localStorage.setItem('token', 'fake-jwt-token');

/* == TESTS == */
describe(`Create Event when user is organizer`, () => {

  beforeAll(() => getToken())
  afterAll(() =>  localStorage.clear())
  beforeEach(async () => {
    await waitFor(() => {
      renderWithRouter('/dashboard');
    })

  })

  it(`Create Events: Side bar, create event fields and button should appear`, async () => {

    // Check elements
    const { sideMenu, pageHeader, fieldTitle, fieldImgUrl, fieldImgUpload, 
    fieldDateTime, fieldLocation, fieldVenue, fieldGenre, fieldDescription, 
    buttonsCreateEvent
    } = await getCreateEventElements();

    sideMenu.forEach(buttonMenu => expect(buttonMenu).toBeInTheDocument());
    expect(buttonsCreateEvent).toHaveLength(2); // Side menu and form's button
    expect(pageHeader).toBeInTheDocument();
    [fieldTitle, fieldImgUrl, fieldImgUpload, fieldDateTime, fieldLocation, 
    fieldVenue, fieldGenre, fieldDescription].forEach(field => {
      expect(field).toBeInTheDocument();
    });
    
    
  })

  // Tests left: Check side form, test data validation, test submition
  
});