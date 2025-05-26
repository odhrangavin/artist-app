import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

export default function RegisterForm() {
	const [form, setForm] = useState(
		{ email: '', username: '', password: '', confirm: '', role: '' }
	);
	const navigate = useNavigate();

	// Get value from the role button
	const selectedRole = (e) => {
		setForm({ ...form, role: e.target.value });
	};

	const register = async (e) => {
		
		e.preventDefault();
		
		// Check role's value is artist or audience
		if (form.role != 'artist' && form.role != 'audience') {
			alert('Please, tell us if you are an artist or part of the Audience');
			return;
		}
		// Validate password match
		if (form.password !== form.confirm) {
			alert('Passwords do not match');
			return;
		}
		
		// Register user, log in, and redirect to the dashboard
		try {
			const res = await API.post('/users', form);
			localStorage.setItem('token', res.data.token);
			navigate('/dashboard');
		} catch (err) {
			alert('Sign-up error');
		}
	};

	const handleChange = (e) => {
		// Update form's and input field's data
		
		const { name, value } = e.target;
		setForm(prevForm => ({ ...prevForm, [name]: value }));
	}

	return (
		<form onSubmit={register}>
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
				max="20"
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
			<button type="button" name="role" value="artist" onClick={selectedRole}>
				I'm an Artist
			</button>
			<button type="button" name="role" value="audience" onClick={selectedRole}>
				I'm part of the Audience
			</button>
			<br />
			<button type="submit">Register</button>
		</form>
	);
}
