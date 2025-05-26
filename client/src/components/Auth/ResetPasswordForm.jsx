import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordForm() {
	const [form, setForm] = useState({ email: '' });
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Replace with real API call later
		localStorage.setItem('token', 'mock-token');
		navigate('/dashboard');
	};

	return (
		<form onSubmit={handleSubmit}>
				<input 
					placeholder="Email" 
					onChange={e => setForm({ ...form, email: e.target.value })}
					required
				/>
				<br />
				<button type="submit">Reset</button>
		</form>
	);
}
