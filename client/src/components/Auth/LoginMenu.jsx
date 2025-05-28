import { useAuth } from '../../context/AuthContext';
import LogoutButton from './LogoutButton';
import { Link } from "react-router-dom";

export default function LoginMenu() {
    // Show login or logout menu

		const { user, isLoggedIn } = useAuth();

		if (isLoggedIn) {
			return (
				<>
					<li><p>Hi, {user.username}</p></li>
					<li><LogoutButton /></li>
				</>
			);
		} else {		
			return (
				<>
					<li><Link to="/login">Log In</Link></li>
					<li><Link to="/register">Register</Link></li>
				</>
			);
		}
	}; 