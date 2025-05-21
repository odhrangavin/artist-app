// login page
import LoginForm from '../components/LoginForm';

export default function Login() {
    return (
        <div>
            <h2>Welcome to ArtistsApp</h2>
			<p>Show the world what you can do!</p>
			<br />
            <h2>Login</h2>
            { <LoginForm />}
        </div>
    );
}