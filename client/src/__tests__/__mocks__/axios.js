import { vi } from 'vitest';

// Create empty mocks for API axios
const mockAxios = {
  get:  vi.fn((url) => {
    if(url === '/users/me/faves/full') {
      return Promise.resolve({
        data: {
          user: [
            {
              created_at: "2025-06-05",
              description: null,
              event: 1,
              event_date: "2025-06-05",
              event_time: "19:00:00",
              event_user_id: 1,
              external_id: 'abc',
              faves_user_id: 2,
              genre: "Theatre",
              id: 1,
              image_url: "https://example.com",
              location: "Dublin",
              suspended: null,
              title: "Test",
              venue: "Testing Environment"
            }
          ]
        },
      });
    }
 
    if (url === '/users/me/attending') {
      return Promise.resolve({
        data: {
          created_at: "2025-06-05",
          event: 2,
          id: 1,
          user_id: 1
        },
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

