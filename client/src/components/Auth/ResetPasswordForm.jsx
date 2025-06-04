import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

export default function ResetPasswordForm() {
	const [form, setForm] = useState({ newPassword: '', confirm:'', token:'' });
	const [ error, setError ] = useState('');
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		// Send new password and token and redirect to login
		
		e.preventDefault();
		const { newPassword, confirm, token } = form;
		setIsLoading(true); // Show waiting message

    // Check passwords match
    if(newPassword != confirm || !token) {
      setError(`Passwords do not match`);
			setIsLoading(false);
      return;
    }

		try {
			const res = await API.post('/users/password-reset', { token, newPassword });
			navigate('/login');
		} catch (err) {
			setError(`Couldn't reset the password`);
			setIsLoading(false);
		}
	};

	const handleChange = (e) => {
	// Update form's and input field's data
	
		const { name, value } = e.target;
		setForm(prevForm => ({ ...prevForm, [name]: value }));
	}

	return (
		<form onSubmit={handleSubmit}>
				<input 
					name="newPassword"
					placeholder="New Password"
					type="password"
					value={form.newPassword}
					onChange={handleChange}
					required
				/>
				<br />
        <input 
					name="confirm"
					placeholder="Confirm New Password"
					type="password"
					value={form.confirm}
					onChange={handleChange}
					required
				/>
				<br />
        {/* For now the token is passed as a field. It should be removed while sending an email */}
        <input 
					name="token"
					placeholder="Token"
					type="text"
					value={form.token}
					onChange={handleChange}
					required 
				/> 
				<br />
				<button type="submit" 
					disabled={!form.newPassword || !form.confirm || !form.token}
				>
					{!isLoading ? 'Confirm Reset' : 'Please Wait'}
					</button>
				<br />
				<span className='error-message' data-testid='error-message'>{error}</span>
		</form>
	);
}
