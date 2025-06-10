// login page
import { Link } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import './Auth.scss';

export default function Login() {
    return (
        <>
            <h2>Welcome to ArtistsApp</h2>
            <p>Show the world what you can do!</p>
            <div className='auth-section'>
                <h2>Log In</h2>
                { <LoginForm />}
                <p>Forgotten your password? <Link to="/forgot-password">Click here</Link></p>
            </div>
        </>
    );
}