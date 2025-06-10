// register page
import RegisterForm from '../../components/Auth/RegisterForm';
import './Auth.scss';

export default function Register() {
	return (
		<>
			<h2>Welcome to ArtistsApp</h2>
			<p>Show the world what you can do!</p>
			<div className='auth-section'>
				<h2>Register</h2>
				< RegisterForm />
			</div>
		</>
	);
}
