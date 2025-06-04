import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 

export default function LoginForm() {
	const [form, setForm] = useState({ username: '', password: '' });
	const [error, setError] = useState('');
	const { login } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		// Send data to the server to login
		
		e.preventDefault();
		setIsLoading(true); // Show waiting message
	
		try {
			await login(form);		
		} catch (err) {
			// Show error message
			setError(err.message);
			setIsLoading(false);
		}
		
	};

	const handleChange = (e) => {
		// Update form's and input field's data

		const { name, value } = e.target;
			
		setForm(prevForm => ({ ...prevForm, [name]: value }));
		

	};

	return (
		<form onSubmit={handleSubmit}>
				<input 
					name="username"
					value={form.username}
					placeholder="Username" 
					onChange={handleChange}
					maxLength="25"
					required
				/>
				<br />
				<input 
					name="password"
					type="password" 
					value={form.password}
					placeholder="Password"
					onChange={handleChange}
					required
				/>
				<br />
				<button type="submit" disabled={!form.username || !form.password}>
					{!isLoading ? 'Log In' : 'Please Wait'}
				</button>
				<br />
				<span className='error-message' data-testid='error-message'>{error}</span>
		</form>
	);
}
