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

export const mockUseAuthLoggedIn = {
  user: { id: 1, username: 'usertest', email: 'user@test.com' },
  isLoggedIn: true,
  login: mockLogin,
  logout: mockLogout,
};


