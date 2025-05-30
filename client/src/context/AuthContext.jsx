import { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

// Create global context that will be used by the components
const AuthContext = createContext(); 

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Get user data to continue session and export to other components
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await API.get('/users/me');
          setUser(res.data.user); 
        } catch (err) {
          // If token is invalid or expired, delete it with the user data
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };
    fetchUser();
  }, []); // [] means the function is executed once unless the component is restarted.

  // login function
  const login = async (credentials) => {
    try {
      // Request token and save it
      const res = await API.post('/login', credentials);
      localStorage.setItem('token', res.data.token);
      
      // Fetch user data after login
      const userRes = await API.get('/users/me');
      setUser(userRes.data.user);
    } catch (err) {
      if (!err.response || err.response.status !== 400) {
        throw Error('Oops! There was a problem. Try again shortly.');
      } else {
        throw Error('Incorrect username or password.');
      }
    }
    
    // Redirect to dashboard
    navigate('/dashboard');
  };

  // logout function
  const logout = () => {
    // Remove token and clean user session data
    localStorage.removeItem('token');
    setUser(null);
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use context easily
export function useAuth() {
  return useContext(AuthContext);
}
