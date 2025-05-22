import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

export default function LoginForm() {
	const [form, setForm] = useState({ username: '', password: '' });
	const navigate = useNavigate();

	const login = async (e) => {
		e.preventDefault();
		// Call authentication API
		try {
			const res = await API.post('/auth/login', { 
				username: form.username, 
				password: form.password 
			});
			// Save token and redirect to dashboard
			localStorage.setItem('token', res.data.token);
			navigate('/dashboard');
		} catch (err) {
			alert('Login error')
		}
	};

	return (
		<form onSubmit={login}>
				<input 
					value={form.username}
					placeholder="Username" 
					onChange={e => setForm({ ...form, username: e.target.value })}
				/>
				<br />
				<input 
					type="password" 
					value={form.password}
					placeholder="Password"
					onChange={e => setForm({ ...form, password: e.target.value })}
				/>
				<br />
				<button type="submit">Login</button>
		</form>
	);
}
