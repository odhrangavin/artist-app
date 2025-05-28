import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AuthProvider } from '../context/AuthContext.jsx';
import App from '../App';


function renderWithRouter(route='/') {
  // Renders a specific route, by default index.
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
}

export default renderWithRouter;