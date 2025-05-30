import { vi } from 'vitest';

// Create empty mocks for API axios
const mockAxios = {
  get: vi.fn(() => Promise.resolve({
      data: {
        _embedded: {
          events: [],
        },
      },
    })),
  post: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
};

export default mockAxios;

