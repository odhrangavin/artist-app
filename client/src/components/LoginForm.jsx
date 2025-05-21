import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const [form, setForm] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Replace with real API call later
        localStorage.setItem('token', 'mock-token');
        navigate('/dashboard');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
            <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
            <button type="submit">Login</button>
        </form>
    );
}
