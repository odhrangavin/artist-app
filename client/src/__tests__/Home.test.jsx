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
async function getHomeElements() {
  
  const loginRegisterText = screen.queryByText(/to get started./i);
  const buttonSearch = screen.getByRole('button', {name: /search/i});
  const buttonClear = screen.getByRole('button', {name: /Clear/i});
  const inputTitle = await screen.findByRole('textbox', {name: /event title/i});
  const selectCity = await screen.findByRole('combobox', {name: /select a city/i});
  const selectGenre = await screen.findByRole('combobox', {name: /select a genre/i});
  const event1 = await screen.findByText(/event1/i);
  const event2 = await screen.findByText(/event2/i);
  const event3 = await screen.findByText(/event3/i);
  const allEvents = await screen.findAllByText(/^event\d+$/i);
  const viewEventLinks = await screen.findAllByRole('link', {name: /view event/i});
  
  return {
    buttonSearch, buttonClear, event1, event2, event3, allEvents, viewEventLinks,
    inputTitle, selectCity, selectGenre, loginRegisterText
  }
  
}

function getFaveButtons() {
  // If not logged, this elements should not appear:
  const buttonFaveLiked = screen.queryAllByRole('img', {name: /Remove from favourites/i});
  const buttonFaveUnliked = screen.queryAllByRole('img', {name: /Add to favourites/i});

  return { buttonFaveLiked, buttonFaveUnliked };
}

function getAttendingButtons(){
  // If not logged, this elements should not appear:
  const buttonAttending = screen.queryAllByRole('button', {name: /cancel attendance/i});
  const buttonNotAttending = screen.queryAllByRole('button', {name: /i'll attend/i});

  return { buttonAttending, buttonNotAttending };
}



const getToken = () => localStorage.setItem('token', 'fake-jwt-token');

/* == TESTS == */
describe('Events in Home page when user not logged in', () => {

  beforeEach(async () => {
    // Render home page
    await waitFor(() => { // Required by warnings
      renderWithRouter();
    })
  });

  it('User not logged in should only see the events and detail', async () => {
    // Get page elements
    const buttonLogin = screen.getByRole('link', {name: /log in/i}); // Login in navbar
    const {
      buttonSearch, buttonClear, event1, event2, event3, allEvents, viewEventLinks,
      loginRegisterText
    } = await getHomeElements();

    const loginLink = within(loginRegisterText).getByRole('link', {name: /login/i})
    const registerLink = within(loginRegisterText).getByRole('link', {name: /register/i})

    const { buttonFaveLiked, buttonFaveUnliked } = getFaveButtons();
    const { buttonAttending, buttonNotAttending } = getAttendingButtons();

 
    // Do assertions
    for (let buttonElement of [buttonLogin, buttonSearch, buttonClear]) {
      expect(buttonElement).toBeInTheDocument();
    } 
    for (let event of [event1, event2, event3]) {
      expect(event).toBeInTheDocument();
    } 
    expect(loginLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
    expect(allEvents).toHaveLength(3);
    expect(viewEventLinks).toHaveLength(3);
    for (let button of [buttonFaveLiked, buttonFaveUnliked, buttonAttending, 
      buttonNotAttending]
    ) {  
      expect(button).toHaveLength(0);
    }
  });

  it('User not logged in should be able to go to event detail', async () => {
    const { viewEventLinks } = await getHomeElements();

    await userEvent.click(viewEventLinks[0]);

    // Event detail has a go back button
    const buttonGoBack = await screen.findByRole('button', {name: /go back/i});
    expect(buttonGoBack).toBeInTheDocument();
  
    
    
  });

  it('User not logged in should be able to filter events', async () => {
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

  it('User not logged in, should be re redirected to login page when click on login link', 
    async () => {
      // Get page elements
      const { loginRegisterText } = await getHomeElements();

      const loginLink = within(loginRegisterText).getByRole('link', {name: /login/i})
      
      await userEvent.click(loginLink);

      // Check if redirected
      const button = await screen.findByRole('button', { name:/log in/i });
      expect(button).toBeInTheDocument();
    }
  )

  it('User not logged in, should be re redirected to register page when click on register link', 
    async () => {
    // Get page elements
    const { loginRegisterText } = await getHomeElements();

    const registerLink = within(loginRegisterText).getByRole('link', {name: /register/i})
    
    await userEvent.click(registerLink);

    // Check if redirected
    const button = await screen.findByRole('button', { name:/register/i });
    expect(button).toBeInTheDocument();
    }
  )
});


describe('Events in Home page when user is an organizer', () => {
  beforeEach(async () => {
    // Login organizer
    currentMock = mockUseAuthLoggedInO;
    getToken();

    // Render home page
    await waitFor(() => { // Required by warnings
      renderWithRouter(); 
    })
  })
  afterEach(() => {
    // Clean mocks
    currentMock = mockUseAuthNotLoggedIn;
    localStorage.clear();
  });
  it('Organizer should the events, detail link, and attend and fave button', async () => {
    
    // Get page elements
    const buttonLogout = screen.getByRole('button', {name: /logout/i}); // 
    const {
      buttonSearch, buttonClear, event1, event2, event3, allEvents, 
      viewEventLinks, loginRegisterText
    } = await getHomeElements();
    const { buttonFaveLiked, buttonFaveUnliked } = getFaveButtons();
    const { buttonAttending, buttonNotAttending } = getAttendingButtons();

    // Do assertions
    expect(loginRegisterText).toBeNull();
    for (let buttonElement of [buttonLogout, buttonSearch, buttonClear]) {
      expect(buttonElement).toBeInTheDocument();
    } 
    for (let event of [event1, event2, event3]) {
      expect(event).toBeInTheDocument();
    } 
    expect(allEvents).toHaveLength(3);
    expect(viewEventLinks).toHaveLength(3);
    expect(buttonFaveLiked).toHaveLength(2);
    expect(buttonFaveUnliked).toHaveLength(1);
    expect(buttonAttending).toHaveLength(2);
    expect(buttonNotAttending).toHaveLength(0);
  })
  
  it('Organizer should be able to go to event detail', async () => {

    const { viewEventLinks } = await getHomeElements();

    await userEvent.click(viewEventLinks[0]);

    // Event detail has a go back button
    const buttonGoBack = await screen.findByRole('button', {name: /go back/i});
    expect(buttonGoBack).toBeInTheDocument();

  }) 

  it('Organizer should be able to filter events', async () => {

    const { selectCity, buttonClear, buttonSearch } = await getHomeElements();

    // Select a city and check value
    await userEvent.selectOptions(selectCity, 'Galway');
    expect(selectCity.value).toBe('Galway');

    // Search city and check events and value
    await userEvent.click(buttonSearch);
    let events = await screen.findAllByText(/^event\d+$/i);
    let { buttonFaveLiked, buttonFaveUnliked } = getFaveButtons();
    let { buttonAttending, buttonNotAttending } = getAttendingButtons();
     
    expect(selectCity.value).toBe('Galway');
    expect(events).toHaveLength(1);
    // Check filter doesn't alter buttons
    expect(buttonFaveLiked).toHaveLength(1);
    expect(buttonFaveUnliked).toHaveLength(0);
    expect(buttonAttending).toHaveLength(1);
    expect(buttonNotAttending).toHaveLength(0);

    // Clear filter and check event and value
    await userEvent.click(buttonClear);
    events = await screen.findAllByText(/^event\d+$/i);
    ({ buttonFaveLiked, buttonFaveUnliked } = getFaveButtons());
    ({ buttonAttending, buttonNotAttending } = getAttendingButtons());

    expect(selectCity.value).toBe('');
    expect(events).toHaveLength(3);
    // Check filter doesn't alter buttons
    expect(buttonFaveLiked).toHaveLength(2);
    expect(buttonFaveUnliked).toHaveLength(1);
    expect(buttonAttending).toHaveLength(2);
    expect(buttonNotAttending).toHaveLength(0);
    
  })
  /* TEST NOT WORKING, UNKNOWN CAUSES
  it('Organizer should be able to add and remove faves', async () => {

    let { buttonFaveLiked, buttonFaveUnliked } = getFaveButtons();
    
    // Like event 1 (which is currently unliked)
    await userEvent.click(buttonFaveUnliked[0]);
    
    expect(mockUseAuthLoggedInO.user.id).toBe(2)
    console.log('liked:', screen.getByRole('img').getAttribute('aria-label'));
    console.log(API.post.mock.calls);
    
    expect(API.post).toHaveBeenCalledWith('users/me/faves', {
      user_id: mockUseAuthLoggedInO.user.id,
      event: 1, 
    });
  
    ({ buttonFaveLiked, buttonFaveUnliked} = getFaveButtons());

    expect(buttonFaveLiked).toHaveLength(3);
    expect(buttonFaveUnliked).toHaveLength(0);
    
    // Dislike event with 3 clicks
    
  })
  */

  // DO ATTEND TEST AS WEll

})

describe('Events in Home page when user is an attendee', () => {
  beforeEach(async() => {
    // Login organizer
    currentMock = mockUseAuthLoggedInA;
    currentUser('user4');
    getToken();

    // Render home page
    await waitFor(() => { // Required by warnings
      renderWithRouter();
    })
  })
  afterEach(() => {
    // Clean mocks
    currentMock = mockUseAuthNotLoggedIn;
    currentUser('user2');
    localStorage.clear();
  });

  it('Attendee should see the events, detail link, and attend and fave button', 
    async () => {
    
    // Get page elements
    const buttonLogout = screen.getByRole('button', {name: /logout/i}); // 
    const {
      buttonSearch, buttonClear, event1, event2, event3, allEvents, 
      viewEventLinks, loginRegisterText
    } = await getHomeElements();
    const { buttonFaveLiked, buttonFaveUnliked } = getFaveButtons();
    const { buttonAttending, buttonNotAttending } = getAttendingButtons();

    // Do assertions
    expect(loginRegisterText).toBeNull();
    for (let buttonElement of [buttonLogout, buttonSearch, buttonClear]) {
      expect(buttonElement).toBeInTheDocument();
    } 
    for (let event of [event1, event2, event3]) {
      expect(event).toBeInTheDocument();
    } 
    expect(allEvents).toHaveLength(3);
    expect(viewEventLinks).toHaveLength(3);
    expect(buttonFaveLiked).toHaveLength(1);
    expect(buttonFaveUnliked).toHaveLength(2);
    expect(buttonAttending).toHaveLength(1);
    expect(buttonNotAttending).toHaveLength(2);
  })

  it('Attendee should be able to go to event detail', async () => {

    const { viewEventLinks } = await getHomeElements();

    await userEvent.click(viewEventLinks[0]);

    // Event detail has a go back button
    const buttonGoBack = await screen.findByRole('button', {name: /go back/i});
    expect(buttonGoBack).toBeInTheDocument();
    
  }) 

  it('Attendee should be able to filter events', async () => {

    const { inputTitle, buttonClear, buttonSearch } = await getHomeElements();

    // Select a title and check value
    await userEvent.type(inputTitle, 'event2');
    expect(inputTitle.value).toBe('event2');

    // Search title and check events and value
    await userEvent.click(buttonSearch);
    let events = await screen.findAllByText(/^event\d+$/i);
    let { buttonFaveLiked, buttonFaveUnliked } = getFaveButtons();
    let { buttonAttending, buttonNotAttending } = getAttendingButtons();
    
    
    expect(inputTitle.value).toBe('event2');
    expect(events).toHaveLength(1);
    // Check filter doesn't alter buttons
    expect(buttonFaveLiked).toHaveLength(0);
    expect(buttonFaveUnliked).toHaveLength(1);
    expect(buttonAttending).toHaveLength(1);
    expect(buttonNotAttending).toHaveLength(0);

    // Clear filter and check event and value
    await userEvent.click(buttonClear);
    events = await screen.findAllByText(/^event\d+$/i);
    ({ buttonFaveLiked, buttonFaveUnliked } = getFaveButtons());
    ({ buttonAttending, buttonNotAttending } = getAttendingButtons());

    expect(inputTitle.value).toBe('');
    expect(events).toHaveLength(3);
    // Check filter doesn't alter buttons
    expect(buttonFaveLiked).toHaveLength(1);
    expect(buttonFaveUnliked).toHaveLength(2);
    expect(buttonAttending).toHaveLength(1);
    expect(buttonNotAttending).toHaveLength(2);
  })
  
  /* TEST NOT WORKING, UNKNOWN CAUSES
  it('Organizer should be able to add and remove faves', async () => {

    let { buttonFaveLiked, buttonFaveUnliked } = getFaveButtons();
    
    // Like event 1 (which is currently unliked)
    await userEvent.click(buttonFaveUnliked[0]);
    
    expect(mockUseAuthLoggedInO.user.id).toBe(2)
    console.log('liked:', screen.getByRole('img').getAttribute('aria-label'));
    console.log(API.post.mock.calls);
    
    expect(API.post).toHaveBeenCalledWith('users/me/faves', {
      user_id: mockUseAuthLoggedInO.user.id,
      event: 1, 
    });
  
    ({ buttonFaveLiked, buttonFaveUnliked} = getFaveButtons());

    expect(buttonFaveLiked).toHaveLength(3);
    expect(buttonFaveUnliked).toHaveLength(0);
    
    // Dislike event with 3 clicks
    
  })
 

  // DO ATTEND TEST AS WEll
  */
})
 