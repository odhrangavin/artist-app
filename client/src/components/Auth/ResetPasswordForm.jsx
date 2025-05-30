import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

export default function ResetPasswordForm() {
	const [form, setForm] = useState({ newPassword: '', confirm:'', token:'' });
	const [ error, setError ] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		// Send new password and token and redirect to login
		
		e.preventDefault();
		const { newPassword, confirm, token } = form;

    // Check passwords match
    if(newPassword != confirm || !token) {
      setError(`Passwords do not match`);
      return;
    }

		try {
			const res = await API.post('/users/password-reset', { token, newPassword });
			navigate('/login');
		} catch (err) {
			setError(`Couldn't reset the password`);
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
					Confirm Reset
					</button>
				<br />
				<span className='error-message' data-testid='error-message'>{error}</span>
		</form>
	);
}
