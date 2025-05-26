// ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'

// If the user is logged in, will be able to access a protected page, otherwise
// they will redirected to the login page
export default function ProtectedRoute() {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" />;
}
