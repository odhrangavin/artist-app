import { vi } from 'vitest';

const currentYear = new Date().getFullYear();
// Necesary for tests as there is a filter that removes events older than today.
const nextYear = currentYear + 1; 

// faves/full user mocks
const mockAxiosFavesFullUser2 =  [
  { // User 2 liked event 2
    created_at: '2025-05-04',
    description: null,
    event: 2,
    event_date: `${nextYear}-03-10`,
    event_time: '24:00:00',
    event_user_id: 1,
    external_id: null,
    faves_user_id: 2,
    genre: 'Football',
    id: 1,
    image_url: null,
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

const mockAxiosFavesFullUser3 =  [{ // User 3 liked event 2
  created_at: '2025-05-05',
  description: null,
  event: 2,
  event_date: `${nextYear}-03-10`,
  event_time: '24:00:00',
  event_user_id: 1,
  external_id: 'a',
  faves_user_id: 3,
  genre: 'Football',
  id: 2,
  image_url: null,
  location: 'Cork',
  suspended: null,
  title: 'Event2',
  venue: 'Venue2'
}]

const mockAxiosFavesFullUser4 =  [{ // User 4 liked event 3
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
}]

// Variable that is used for the switch mapping on tests
let selectedUser = 'user2'; // default value
export function currentUser(user) {
  if (user) {
    selectedUser = user; // setter
  }
  return selectedUser; // Getter
}; 

// Create empty mocks for API axios
const mockAxios = {
  get:  vi.fn((url) => {
    if (url === '/events') {
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
              image_url: 'http://localhost/test.png',
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
              event_time: '24:00:00',
              external_id: 'a',
              genre: 'Football',
              id: 2,
              image_url: null,
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

    if (url === '/events/1') {
      return Promise.resolve({
        data: {
          event: { // Event 1
              created_at: '2024-12-19T14:36:58.522Z',
              description: 'Description 1',
              event_date: `${nextYear}-01-01`,
              event_time: '00:30:00',
              external_id: null,
              genre: 'Football',
              id: 1,
              image_url: 'http://localhost/test.png',
              location: 'Dublin',
              suspended: 1,
              title: 'Event1',
              user_id: 2,
              venue: 'Venue1'
          }
        },
      });
    }

    if (url === '/events/2') {
      return Promise.resolve({
        data: {
          event: { // Event 2
              created_at: '2025-01-01T14:36:58.522Z',
              description: null,
              event_date: `${nextYear}-03-10`,
              event_time: '24:00:00',
              external_id: 'a',
              genre: 'Football',
              id: 2,
              image_url: null,
              location: 'Cork',
              suspended: null,
              title: 'Event2',
              user_id: 1,
              venue: 'Venue2'
            }
        },
      });
    }

    if (url === '/events/3') {
      return Promise.resolve({
        data: {
          event: { // Event 3
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
        },
      });
    }

    if (url === '/events/1/attendance') {
      return Promise.resolve({
        data: {
          attendance: 0
        },
      });
    }

    if (url === '/events/2/attendance') {
      return Promise.resolve({
        data: {
          attendance: 3
        },
      });
    }

    if (url === '/events/3/attendance') {
      return Promise.resolve({
        data: {
          attendance: 1
        },
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

    if (url === '/users/me/attending') {
      let responseData;

      switch (currentUser()) { 
        case 'user2':      
          responseData = [
          { // User 2 will attend event 2
            created_at: '2025-06-01',
            event: 2,
            id: 1,
            user_id: 2
          },
          { // User 2 will attend event 3
            created_at: '2025-06-03',
            event: 3,
            id: 3,
            user_id: 2
          }]
          break;     
        case 'user3':
          responseData = [{ // User 3 will attend event 2
            created_at: '2025-06-02',
            event: 2,
            id: 2,
            user_id: 3
          }]
          break;
        case 'user4':
          responseData =  [{ // User 4 will attend event 2
            created_at: '2025-06-06',
            event: 2,
            id: 4,
            user_id: 4
          }]
          break;
        }  
      return Promise.resolve({ data: {
        user: responseData 
      }});
    }

    if (url === '/users/me/events') { // User 2 events
      return Promise.resolve({
        data: {
          events: [
            { // Event 1
              created_at: '2024-12-19T14:36:58.522Z',
              description: 'Description 1',
              event_date: `${nextYear}-01-01`,
              event_time: '00:30',
              external_id: null,
              genre: 'Football',
              id: 1,
              image_url: 'http://localhost/test.png',
              location: 'Dublin',
              suspended: 1,
              title: 'Event1',
              user_id: 2,
              venue: 'Venue1'
            }
          ]
        },
      });
    }


    if (url === '/users/me/faves') {
      let responseData;

      switch (currentUser()) { 
        case 'user2':      
          responseData = [{ // User 2 liked event 2
            created_at: '2025-05-04',
            event: 2,
            user_id: 2,
            id: 1,
          },   
          { // User 2 liked event 3
            created_at: '2025-05-05',
            event: 3,
            user_id: 2,
            id: 3,
          }]
          break;     
        case 'user3':
          responseData = [{ // User 3 liked event 2
            created_at: '2025-05-05',
            event: 2,
            user_id: 3,
            id: 2,
          }]
          break;
        case 'user4':
          responseData =  [{ // User 4 liked event 3
            created_at: '2025-05-06',
            event: 3,
            user_id: 4,
            id: 4,
          }]
          break;
        }  
      return Promise.resolve({ data: {
        user: responseData 
      }});
    }
    
    if (url === '/users/me/faves/full') {
      let responseData;

      switch (currentUser()) {      
        case 'user3':
          responseData = {
            user: mockAxiosFavesFullUser3
          };
          break;
        case 'user4':
          responseData = {
            user: mockAxiosFavesFullUser4
          };
          break;
        case 'user2':      
          responseData = {
            user: mockAxiosFavesFullUser2 
          };
        break;
      }

      return Promise.resolve({ data: responseData });
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
  post: vi.fn((url) => {
    if (url === '/users/me/faves') {
      return Promise.resolve({
      data: {
        lastID: 5,
        changes: 1
      }})
    }
    
    // Default, if url doesn't exist
    return Promise.reject(new Error(`Unhandled POST url: ${url}`));
  }),
  delete: vi.fn((url) => {
    if (url === '/users/me/faves/1') { // User 2 removed fave to event 2
      return Promise.resolve({
        data:{}
      })
    }
    
    // Default, if url doesn't exist
    return Promise.reject(new Error(`Unhandled DELETE url: ${url}`));
  }),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
};



export default mockAxios;


