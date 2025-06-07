import { vi } from 'vitest';

const currentYear = new Date().getFullYear();
// Necesary for tests as there is a filter that removes events older than today.
const nextYear = currentYear + 1; 

// Create empty mocks for API axios
const mockAxios = {
  get:  vi.fn((url) => {
    if(url === '/events') {
      return Promise.resolve({
        data: {
          results: [
            { // Event 1
              created_at: '2024-12-19T14:36:58.522Z',
              description: 'Description 1',
              event_date: `${nextYear}-01-01`,
              event_time: '00:30:00',
              external_id: null,
              genre: 'Football',
              id: 1,
              image_url: 'image_url',
              location: 'Dublin',
              suspended: 1,
              title: 'Event1',
              user_id: 2,
              venue: 'Venue1'
            },
            { // Event 2 (external)
              created_at: '2025-01-01T14:36:58.522Z',
              description: null,
              event_date: `${nextYear}-03-10`,
              event_time: '30:00:00',
              external_id: 'a',
              genre: 'Football',
              id: 2,
              image_url: 'image_url',
              location: 'Cork',
              suspended: null,
              title: 'Event2',
              user_id: 1,
              venue: 'Venue2'
            },
            { // Event 3
              created_at: '2025-01-01T14:37:58.522Z',
              description: 'Description 3',
              event_date: `${nextYear}-02-20`,
              event_time: '00:00:30',
              external_id: null,
              genre: 'Theatre',
              id: 3,
              image_url: 'image_url',
              location: 'Galway',
              suspended: 0,
              title: 'Event3',
              user_id: 3,
              venue: 'Venue3'
            }
          ]
        },
      });
    }

    if(url === '/users/me/faves') {
      return Promise.resolve({
        data: {
          user: [
            { // User 2 liked event 2
              created_at: '2025-05-04',
              event: 2,
              user_id: 2,
              id: 1,
            },
            { // User 3 liked event 2
              created_at: '2025-05-05',
              event: 2,
              user_id: 3,
              id: 2,
            },
            { // User 2 liked event 3
              created_at: '2025-05-05',
              event: 3,
              user_id: 2,
              id: 3,
            },
            { // User 4 liked event 3
              created_at: '2025-05-06',
              event: 3,
              user_id: 4,
              id: 4,
            }
          ]
        },
      });
    }
    
    if(url === '/users/me/faves/full') {
      return Promise.resolve({
        data: {
          user: [
            { // User 2 liked event 2
              created_at: '2025-05-04',
              description: null,
              event: 2,
              event_date: `${nextYear}-03-10`,
              event_time: '00:30:00',
              event_user_id: 1,
              external_id: null,
              faves_user_id: 2,
              genre: 'Football',
              id: 1,
              image_url: 'image_url',
              location: 'Cork',
              suspended: null,
              title: 'Event2',
              venue: 'Venue2'
            },
            { // User 2 liked event 3
              created_at: '2025-05-05',
              description: 'Description 3',
              event: 3,
              event_date: `${nextYear}-02-20`,
              event_time: '00:00:30',
              event_user_id: 3,
              external_id: null,
              faves_user_id: 2,
              genre: 'Theatre',
              id: 3,
              image_url: 'image_url',
              location: 'Galway',
              suspended: 0,
              title: 'Event3',
              venue: 'Venue3'
            },
          ]
        },
      });
    }
 
    if (url === '/users/me/attending') {
      return Promise.resolve({
        data: {
          users: [
            { // User 2 will attend event 2
              created_at: '2025-06-01',
              event: 2,
              id: 1,
              user_id: 2
            },
            { // User 3 will attend event 2
              created_at: '2025-06-02',
              event: 2,
              id: 2,
              user_id: 3
            },
            { // User 2 will attend event 3
              created_at: '2025-06-03',
              event: 3,
              id: 3,
              user_id: 2
            },
            { // User 4 will attend event 2
              created_at: '2025-06-06',
              event: 2,
              id: 4,
              user_id: 4
            },
          ]
        }
      });
    }

    if (url === '/users') {
      return Promise.resolve({
        data: {
          users: [
            { // User 1 - admin
              created_at: '2024-01-01',
              email: 'adminusertest@gmail.com',
              id: 1,
              role: "system-user",
              username: "adminusertest"
            },
            { // User 2 - organizer
              created_at: '2024-01-01',
              email: 'usertest@gmail.com',
              id: 2,
              role: "organizer",
              username: "usertest"
            },
            { // User 3 - organizer
              created_at: '2024-01-01',
              email: 'usertest2@gmail.com',
              id: 3,
              role: "organizer",
              username: "usertest2"
            },
            { // User 4 - attendee
              created_at: '2024-01-01',
              email: 'usertest3@gmail.com',
              id: 4,
              role: "attendee",
              username: "usertest3"
            },
          ]
        }
      });
    }
    
    // External api
    return Promise.resolve({
      data: {
        _embedded: {
          events: [],
        },
      },
    })
  }),
  post: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
};

export default mockAxios;

export const mockAxiosFavesFullUser3 =  { // User 3 liked event 2
    created_at: '2025-05-05',
    description: null,
    event: 2,
    event_date: `${nextYear}-03-10`,
    event_time: '30:00:00',
    event_user_id: 1,
    external_id: 'a',
    faves_user_id: 3,
    genre: 'Football',
    id: 2,
    image_url: 'image_url',
    location: 'Cork',
    suspended: null,
    title: 'Event2',
    venue: 'Venue2'
  }

  export const mockAxiosFavesFullUser4 =  { // User 4 liked event 3
    created_at: '2025-05-06',
    description: 'Description 3',
    event: 3,
    event_date: `${nextYear}-02-20`,
    event_time: '00:00:30',
    event_user_id: 3,
    external_id: null,
    faves_user_id: 4,
    genre: 'Theatre',
    id: 4,
    image_url: 'image_url',
    location: 'Galway',
    suspended: 0,
    title: 'Event3',
    venue: 'Venue3'
  }