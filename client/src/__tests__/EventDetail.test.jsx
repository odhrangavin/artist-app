import { screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import mockAxios, { currentUser } from './__mocks__/axios.js';
import renderWithRouter from './testUtils.jsx';
import { mockUseAuthLoggedInO, mockUseAuthLoggedInA, 
  mockUseAuthNotLoggedIn} from './__mocks__/authContext.js';


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

const testYear = new Date().getFullYear() + 1;

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
    const dateTime = screen.getByText(`${testYear}-01-01 00:30:00`);
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

  it(`Event 1 detail: User should be able to go back to previous page`, async () => {
    await waitFor(() => {
      renderWithRouter();
    })

    // Go to event detail
    const viewEventLink = await screen.findAllByRole('button', {name: /view event/i});
    await userEvent.click(viewEventLink[0]);

    // Check user is in event detail page
    const { goBackButton } = await getEventDetailElements();
    expect(goBackButton).toBeInTheDocument();
    
    // Check go back button works
    await userEvent.click(goBackButton);
    expect(await screen.findByText(/welcome to event app/i)).toBeInTheDocument();
  });
});

describe(`Event Detail when user is organizer`, () => {
  
  beforeEach(async () => {
    // Login organizer
    currentMock = mockUseAuthLoggedInO;
    getToken();

  })
  afterEach(() => {
    // Clean mocks
    currentMock = mockUseAuthNotLoggedIn;
    localStorage.clear();
  });

  it(`Event 2 detail shows  date/time, city, venue, genre, authon, and
    go back button when user is organizer`, async () => {

    await waitFor(() => {
      renderWithRouter('/events/2');
    })

    const { titles, goBackButton } = await getEventDetailElements();
    const { descriptionTitle, defaultImg, suspended } = await getOptionalEventDetailElements();

    titles.forEach(title => expect(title).toBeInTheDocument());
    expect(descriptionTitle).toBeNull(); // Event 2 doesn't have a description
    expect(defaultImg).toBeInTheDocument(); // Event 2 doesn't have a picture
    expect(suspended).toBeNull(); // Event 2 is active
    expect(goBackButton).toBeInTheDocument();
  })
 
  it(`Event 2 detail shows content`, async () => {
    await waitFor(() => {
      renderWithRouter('/events/2');
    })

    const title = screen.getByText('Event2');
    const dateTime = screen.getByText(`${testYear}-03-10 24:00:00`);
    const city = screen.getByText('Cork');
    const venue = screen.getByText('Venue2');
    const genre = screen.getByText('Football');
    const author = await screen.findByText('adminusertest'); // It goes through some useStates

    [title, dateTime, city, venue, genre, author].forEach(
      content => expect(content).toBeInTheDocument
    )
  });

  it(`Event 2 detail shows that three users Are attending`, async () => {
    await waitFor(() => {
      renderWithRouter('/events/2');
    })

    const attendance = await screen.findByText(/3 Event App users are attending./i);
    
    expect(attendance).toBeInTheDocument();
  });

  it(`Event 2 detail: User should be able to go back to previous page`, async () => {
    await waitFor(() => {
      renderWithRouter('/dashboard');
    })

    // Go to event detail
    let allMyEventsButton = await screen.findByRole('button', {name: /all my events/i});
    await userEvent.click(allMyEventsButton);
    const viewEventLink = await screen.findByRole('button', {name: /view event/i});
    await userEvent.click(viewEventLink);

    // Check user is in event detail page
    const { goBackButton } = await getEventDetailElements();
    expect(goBackButton).toBeInTheDocument();
    
    // Check go back button works
    await userEvent.click(goBackButton);
    allMyEventsButton = await screen.findByRole('button', {name: /all my events/i});
    expect(allMyEventsButton).toBeInTheDocument();
  });
});

// Do attendee event 3
describe(`Event Detail when user is attendee`, () => {
  beforeAll(async () => {
    // Login organizer
    currentUser('user4')
  })
  afterAll(() => {
    // Clean mocks
    currentUser('user2')
  });
  beforeEach(async () => {
    // Login organizer
    currentMock = mockUseAuthLoggedInA;
    getToken();
  })
  afterEach(() => {
    // Clean mocks
    currentMock = mockUseAuthNotLoggedIn;
    localStorage.clear();
  });

  it(`Event 3 detail shows  date/time, city, venue, genre, authon, and
    go back button when user is organizer`, async () => {

    await waitFor(() => {
      renderWithRouter('/events/3');
    })
    
    // Simulate picture error
    const imgEvent3 = screen.getByRole('img')
    imgEvent3.dispatchEvent(new Event('error'));

    const { titles, goBackButton } = await getEventDetailElements();
    const { descriptionTitle, defaultImg, suspended } = await getOptionalEventDetailElements();

    // Simulte error process in image
    titles.forEach(title => expect(title).toBeInTheDocument());
    expect(descriptionTitle).toBeInTheDocument();
    expect(defaultImg).toBeInTheDocument(); 
    expect(suspended).toBeNull(); // Event 3 is active
    expect(goBackButton).toBeInTheDocument();
  })

  it(`Event 3 detail shows content`, async () => {
    await waitFor(() => {
      renderWithRouter('/events/3');
    })

    const title = screen.getByText('Event3');
    const description = screen.getByText('Description 3');
    const dateTime = screen.getByText(`${testYear}-02-20 00:00:30`);
    const city = screen.getByText('Galway');
    const venue = screen.getByText('Venue3');
    const genre = screen.getByText('Theatre');
    const author = await screen.findByText('usertest2'); // It goes through some useStates

    [title, dateTime, city, venue, genre, author].forEach(
      content => expect(content).toBeInTheDocument
    )
  });

  it(`Event 3 detail shows that one user is attending`, async () => {
    await waitFor(() => {
      renderWithRouter('/events/3');
    })

    const attendance = await screen.findByText(/1 Event App user is attending./i);
    
    expect(attendance).toBeInTheDocument();

  });
 
  it(`Event 3 detail: User should be able to go back to previous page`, async () => {
    await waitFor(() => {
      renderWithRouter();
    })

    // Go to event detail
    const viewEventLink = await screen.findAllByRole('button', {name: /view event/i});
    await userEvent.click(viewEventLink[2]);

    // Check user is in event detail page
    const { goBackButton } = await getEventDetailElements();
    expect(goBackButton).toBeInTheDocument();
    
    // Check go back button works
    await userEvent.click(goBackButton);
    expect(await screen.findByText(/welcome to event app/i)).toBeInTheDocument();
  }); 
});
