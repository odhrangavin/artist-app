import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext'; 

export default function LoginForm() {
	const [form, setForm] = useState({ username: '', password: '' });
	const { login } = useAuth();

	const handleSubmit = async (e) => {
		// Send data to the server to login
		
		e.preventDefault();
		// Call authentication API
		login(form);

	};

	const handleChange = (e) => {
		// Put data on the form and the input field after the user types

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
				<button type="submit">Login</button>
		</form>
	);
}
