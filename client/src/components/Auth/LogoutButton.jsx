import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LogoutButton() {
  
  const { logout } = useAuth();
  const handleClick = logout;

  return <button onClick={handleClick}>Logout</button>
}