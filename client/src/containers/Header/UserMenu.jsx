import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../../components/Auth/LogoutButton';
import { NavLink } from "react-router-dom";

export default function UserMenu() {
	// Show login or logout menu

	const { user, isLoggedIn } = useAuth();

	if (isLoggedIn) {
		return (
			<>
				<li><NavLink to="/dashboard">Dashboard</NavLink></li>
				<li><p className='greeting-message'>Hi, {user.username}</p></li>
				<li><LogoutButton /></li>
			</>
		);
	} else {
		return (
			<>
				<li><NavLink to="/login">Log In</NavLink></li>
				<li><NavLink to="/register">Register</NavLink></li>
			</>
		);
	}
}; 