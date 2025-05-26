import { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

// Create global context that will be used by the components
const AuthContext = createContext(); 

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Search user data and put it in a variable
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await API.get('/api/users/me'); // TODO check path. ID is handled by the token and JWT
          setUser(res.data.user); 
        } catch (err) {
          // If token is invalid or expired, delete token and user context data
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };
    fetchUser(); // Execute function
  }, []); // [] means the function is executed once unless the component is restarted.

  // login function
  const login = async (credentials) => {
    // Request token and save token
    try {
      const res = await API.post('/api/login', credentials);
      localStorage.setItem('token', res.data.token);
      
      // Fetch user
      const userRes = await API.get('/api/users/me'); // TODO check path. ID is handled by the token and JWT
      setUser(userRes.data.user);
    } catch (err) {
      alert('Login error');
      console.log(err.message);
    }
    
    // Redirect to dashboard
    navigate('/dashboard');
  };

  // logout function
  const logout = () => {
    // Remove token and clean user session data
    localStorage.removeItem('token');
    setUser(null);
    
    //  Redirect to login
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
