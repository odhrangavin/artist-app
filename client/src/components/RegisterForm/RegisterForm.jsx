import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

export default function RegisterForm() {
	const [form, setForm] = useState(
		{ email: '', username: '', password: '', confirm: '' }
	);
	const navigate = useNavigate();

	const register = async (e) => {
		
		// Validate password match
		if (form.password !== form.confirm) {
			alert('Passwords do not match');
			return;
		}
		
		e.preventDefault();
		// Register user, log in, and redirect to the dashboard
		try {
			const res = await API.post('/auth/register', form);
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
			<button type="submit">Register</button>
		</form>
	);
}
