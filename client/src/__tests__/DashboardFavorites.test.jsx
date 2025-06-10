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
let currentAuthMock = mockUseAuthLoggedInO;
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: () => currentAuthMock,  // Both organizer and attendee can see the page
  };
});

/*  == DRY FUNCTIONS == */
async function getFavoriteElements() {
  const createEventButton = await screen.findByRole('button', {name: /create event/i});
  const allMyEventsButton = await screen.findByRole('button', {name: /all my events/i});
  const favorites = await screen.findByRole('button', {name: /favorites/i});
  const imgs = await screen.findAllByRole('img', {name: /event.*/i});
  
  const dateTimeTitles = await screen.findAllByText('Date/Time:');
  const cityTitles = await screen.findAllByText('City:');
  const venueTitles = await screen.findAllByText('Venue:');
  const genreTitles = await screen.findAllByText('Genre:');
  const viewEventButtons = await screen.findAllByRole('button', {name: /view event/i});
  
  return {
    sideMenu: [createEventButton, allMyEventsButton, favorites],
    titles: [dateTimeTitles, cityTitles, venueTitles, genreTitles], 
    viewEventButtons, imgs
  }
}

async function getOptionalFavoriteElements() {
  const editEventButtons = screen.queryAllByRole('button', {name: /edit event/i});
  const suspendedTags = screen.queryAllByText('Suspended');
  const favesUnliked = screen.queryAllByRole('img', {name: /add to favourites/i}); 
  const favesLiked = screen.queryAllByRole('img', {name: /remove from favourites/i}); 
  const attendingButton = screen.queryAllByRole('button', {name: /cancel attendance/i}); 
  const notAttendingButton = screen.queryAllByRole('button', {name: /i'll attend/i}); 

  return {
    editEventButtons, suspendedTags, favesUnliked, favesLiked, attendingButton,
    notAttendingButton
  }
}

const getToken = () => localStorage.setItem('token', 'fake-jwt-token');

const testYear = new Date().getFullYear() + 1;

/* == TESTS == */
describe(`Favorite Events when user is organizer`, () => {

  beforeAll(() => getToken())
  afterAll(() =>  localStorage.clear())
  beforeEach(async () => {
    await waitFor(() => {
      renderWithRouter('/dashboard');
    })

    // Go to favorite events
    const favoriteEventsButton = await screen.findByRole('button', {name: /favorites/i});
    await userEvent.click(favoriteEventsButton);

  })


  it(`Favorite Events: Side bar, events 2-3, edit, fave and attending buttons should appear`, async () => {

    // Check elements
    const { sideMenu, titles, viewEventButtons, imgs } = await getFavoriteElements();
    const { editEventButtons, suspendedTags, favesUnliked, favesLiked, attendingButton,
    notAttendingButton } = await getOptionalFavoriteElements();

    sideMenu.forEach(buttonMenu => expect(buttonMenu).toBeInTheDocument());
    titles.forEach(title => expect(title).toHaveLength(2));
  
    [imgs, viewEventButtons, favesLiked, attendingButton].forEach(element => {
      expect(element).toHaveLength(2);
    });
    [editEventButtons, suspendedTags, favesUnliked, notAttendingButton].forEach(element => {
      expect(element).toHaveLength(0);
    });
    
  })

  it(`Favorite Events: Event 2 content should appear`, async () => {
  
    // Get elements
    const defaultImg = await screen.findByRole('img', {name: /event image/i});
    const title = screen.getByText('Event2');
    const description = screen.getByText(/no description available/i);
    const dateTime = screen.getByText(`${testYear}-03-10 24:00:00`);
    const city = screen.getByText('Cork');
    const venue = screen.getByText('Venue2');
    const genre = screen.getByText('Football');
    // There is no Author here

    // Assert them
    [title, description, dateTime, city, venue, genre, defaultImg].forEach(
      content => expect(content).toBeInTheDocument()
    );
    
  })

  it(`Favorite Events: Event 3 content should appear`, async () => {
  
    // Prepare image error
    const { imgs } =  await getFavoriteElements();
    imgs[1].dispatchEvent(new Event('error'));

    // Check elements
    const defaultImg = await screen.findAllByRole('img', {name: /event image/i});
    const title = screen.getByText('Event3');
    const description = screen.getByText(/description 3/i);
    const dateTime = screen.getByText(`${testYear}-02-20 00:00:30`);
    const city = screen.getByText('Galway');
    const venue = screen.getByText('Venue3');
    const genre = screen.getByText('Theatre');
    // There is no Author here

    [title, description, dateTime, city, venue, genre].forEach(
      content => expect(content).toBeInTheDocument()
    );
    expect(defaultImg).toHaveLength(2);
    
  })
  
  it(`Favorite events: Organizer should be able to go to Event Detail`, async () => {

    const { viewEventButtons } = await getFavoriteElements();
    await userEvent.click(viewEventButtons[0]);

    // Should be in event detail page
    const goBackButton = await screen.findByRole('button', {name: /go back/i});
    expect(goBackButton).toBeInTheDocument();

  });

  it(`Favorite events: Organizer should be able to remove an event`, async () => {
    
    const { favesLiked } = await getOptionalFavoriteElements();
    await userEvent.click(favesLiked[0]);
    
    // Face now should be disliked 
    expect(favesLiked[0]).toHaveAttribute('aria-label', 'Add to favourites'); // It means the evemt will disappear
  });

  // Test lefts: IF event disappeared / Attend button

});

// Test attendee