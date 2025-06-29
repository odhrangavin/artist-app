// src/mocks/authContext.js
import { vi } from 'vitest';

export const mockLogin = vi.fn();
export const mockLogout = vi.fn();


export const mockUseAuthNotLoggedIn = {
  user: null,
  isLoggedIn: false,
  login: mockLogin,
  logout: mockLogout,
};

export const mockUseAuthLoggedInO = {
  user: { id: 2, username: 'usertest', email: 'user@test.com', role: 'organizer' },
  isLoggedIn: true,
  login: mockLogin,
  logout: mockLogout,
};

export const mockUseAuthLoggedInA = {
  user: { id: 4, username: 'usertest3', email: 'user3@test.com', role: 'attendee' },
  isLoggedIn: true,
  login: mockLogin,
  logout: mockLogout,
};


