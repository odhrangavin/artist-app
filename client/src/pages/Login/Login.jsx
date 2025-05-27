// login page
import { Link } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';

export default function Login() {
    return (
        <div>
            <h2>Welcome to ArtistsApp</h2>
			<p>Show the world what you can do!</p>
			<br />
            <h2>Login</h2>
            { <LoginForm />}
            <p>Forgotten your password? <Link to="/reset">Click here</Link></p>
        </div>
    );
}