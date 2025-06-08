import { Link } from 'react-router-dom';
import ExternalEventList from '../../components/ExternalEventList/ExternalEventList';
import UserEventsList from '../../components/UserEventsList/UserEventsList.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './Home.css';


export default function Home() {
	const { isLoggedIn } = useAuth();
	return (
		<div>
			<h2>Welcome to Event App</h2>
			<p>Search and save your favorite events.</p> 
			{!isLoggedIn && <p>
				<Link to="/login">Login</Link> or&nbsp;
				<Link to="/register">Register</Link> to get started.
			</p>}

		{/* <ExternalEventList /> */}
		<UserEventsList />
	</div>
	);
}

