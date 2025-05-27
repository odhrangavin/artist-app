import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

import App from '../App';

// Test App.jsx renders correctly
describe('App', () => {
  it('renders without crashing', () => {
    render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    );
    expect(true).toBe(true);
  });
});