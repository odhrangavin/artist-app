import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 

export default function LoginForm() {
	const [form, setForm] = useState({ username: '', password: '' });
	const { login } = useAuth();

	const handleSubmit = async (e) => {
		// Send data to the server to login
		
		e.preventDefault();
		login(form);

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
				<button type="submit">Log in</button>
		</form>
	);
}
