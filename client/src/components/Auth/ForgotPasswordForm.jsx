import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

export default function ForgotPasswordForm() {
	const [form, setForm] = useState({ email: '' });
	const [error, setError] = useState('')
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		// Request reset and redirect to login
		
		e.preventDefault();
		setIsLoading(true); // Show waiting message
		
		try {
			const res = await API.post('/users/request-reset', form);
			navigate('/reset-password');
		} catch (err) {
			setError('Wrong email or server error.')
			setIsLoading(false);
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
				<button type="submit" disabled={!form.email}>
					{!isLoading ? 'Request Reset' : 'Please Wait'}
				</button>
				<span className='error-message' data-testid='error-message'>{error}</span>
		</form>
	);
}
