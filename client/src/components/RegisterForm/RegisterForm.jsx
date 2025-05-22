import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
	const [form, setForm] = useState(
		{ email: '', username: '', password: '', confirm: '' }
	);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Replace with real API call later
		localStorage.setItem('token', 'mock-token');
		navigate('/dashboard');
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>Email Address</label>
			<input 
				type="email"
				placeholder="abc@example.com" 
				onChange={e => setForm({ ...form, email: e.target.value })}
				required 
			/>
			<br />
			<label>Username</label>
			<input 
				type="text"
				max="20"
				placeholder="Username" 
				onChange={e => setForm({ ...form, username: e.target.value })} 
				required
			/>
			<br />
			<label>Password</label>
			<input 
				type="password" 
				placeholder="Create a password" 
				onChange={e => setForm({ ...form, password: e.target.value })} 
				required
			/>
			<br />
			<label>Confirm Password</label>
			<input 
				type="password" 
				placeholder="Repeat the password" 
				onChange={e => setForm({ ...form, confirm: e.target.value })} 
				required
			/>
			<br />
			<button type="submit">Register</button>
		</form>
	);
}
