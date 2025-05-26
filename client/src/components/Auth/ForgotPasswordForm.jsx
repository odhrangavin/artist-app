import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

export default function ForgotPasswordForm() {
	const [form, setForm] = useState({ email: '' });
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		// Request reset and redirect to login
		
		e.preventDefault();
		
		try {
			const res = await API.post('/users/request-reset', form);
			navigate('/reset-password');
		} catch (err) {
			alert('Wrong email or server error.')
		}
	};

	return (
		<form onSubmit={handleSubmit}>
				<input 
					placeholder="Email"
					type="email"
					value={form.email}
					onChange={e => setForm({ ...form, email: e.target.value })}
					required
				/>
				<br />
				<button type="submit">Request Reset</button>
		</form>
	);
}
