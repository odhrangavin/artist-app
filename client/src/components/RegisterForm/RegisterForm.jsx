import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

export default function RegisterForm() {
	const [form, setForm] = useState(
		{ email: '', username: '', password: '', confirm: '', role: '' }
	);
	const navigate = useNavigate();

	// Get value from button
	const selectedRole = (e) => {
		setForm({ ...form, role: e.target.value });
	};

	
	const register = async (e) => {
		
		e.preventDefault();

		// Validate password match
		if (form.password !== form.confirm) {
			alert('Passwords do not match');
			return;
		}
		
		// Register user, log in, and redirect to the dashboard
		const { confirm, ...dataToSend } = form;
		try {
			const res = await API.post('/auth/register', dataToSend);
			localStorage.setItem('token', res.data.token);
			navigate('/dashboard');
		} catch (err) {
			alert('Sign-up error');
		}
	};

	return (
		<form onSubmit={register}>
			<label>Email Address</label>
			<input 
				type="email"
				value={form.email}
				placeholder="abc@example.com" 
				onChange={e => setForm({ ...form, email: e.target.value })}
				required 
			/>
			<br />
			<label>Username</label>
			<input 
				type="text"
				value={form.username}
				max="20"
				placeholder="Username" 
				onChange={e => setForm({ ...form, username: e.target.value })} 
				required
			/>
			<br />
			<label>Password</label>
			<input 
				type="password" 
				value={form.password}
				placeholder="Create a password" 
				onChange={e => setForm({ ...form, password: e.target.value })} 
				required
			/>
			<br />
			<label>Confirm Password</label>
			<input 
				type="password" 
				value={form.confirm}
				placeholder="Repeat the password" 
				onChange={e => setForm({ ...form, confirm: e.target.value })} 
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
