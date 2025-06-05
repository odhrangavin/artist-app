import { useState } from 'react';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext'

export default function RegisterForm() {
	const [form, setForm] = useState(
		{ email: '', username: '', password: '', confirm: '', role: '' }
	);
	const [error, setError] = useState('');
	const { login } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	// Get value from the role button
	const selectedRole = (e) => {
		setForm({ ...form, role: e.target.value });
	};

	const handleSubmit = async (e) => {	
		e.preventDefault();
		setIsLoading(true); // Show waiting message
		
		// Check role's value is artist or audience
		if (form.role != 'organizer' && form.role != 'attendee') {
			setError('Please, tell us if you are an artist or part of the Audience');
			setIsLoading(false);
			return;
		}
		// Validate password match
		if (form.password !== form.confirm) {
			setError('Passwords do not match');
			setIsLoading(false);
			return;
		}
		
		// Complete registration
		try {
			// Register
			await API.post('/users', form);
			
			// Log in and redirect to dashboard
			const { username, password } = form;
			login({ username, password });

		} catch (err) {
			setError('Sign-up error');
			setIsLoading(false);
		}
	};

	const handleChange = (e) => {
		// Update form's and input field's data
		
		const { name, value } = e.target;
		setForm(prevForm => ({ ...prevForm, [name]: value }));
	}

	return (
		<form onSubmit={handleSubmit}>
			<label>Email Address</label>
			<input 
				name="email"
				type="email"
				value={form.email}
				placeholder="abc@example.com" 
				onChange={handleChange}
				required 
			/>
			<br />
			<label>Username</label>
			<input 
				name="username"
				type="text"
				value={form.username}
				maxLength="25"
				placeholder="Username" 
				onChange={handleChange} 
				required
			/>
			<br />
			<label>Password</label>
			<input 
				name="password"
				type="password" 
				value={form.password}
				placeholder="Create a password" 
				onChange={handleChange} 
				required
			/>
			<br />
			<label>Confirm Password</label>
			<input 
				name="confirm"
				type="password" 
				value={form.confirm}
				placeholder="Repeat the password" 
				onChange={handleChange} 
				required
			/>
			<br />
			<h4>How would you like to use ArtistsApp?</h4>
			<button 
				type="button" 
				name="role" 
				value="organizer" 
				aria-label="organizer" 
				onClick={selectedRole}
			>
				I want to create events
			</button>
			<button 
				type="button" 
				name="role" 
				value="attendee" 
				aria-label="attendee" 
				onClick={selectedRole}
			>
				I want to attend events
			</button>
			<br />
			<button type="submit" 
				disabled={Object.values(form).some(fieldValue => !fieldValue)}
			>
				{!isLoading ? 'Register' : 'Please Wait'}
			</button>
			<br />
			<span className='error-message' data-testid='error-message'>{error}</span>
		</form>
	);
}
