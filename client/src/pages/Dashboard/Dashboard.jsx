import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import './Dashboard.css';


function EventPreview({ event }) {
    if (!event.title && !event.description) return null;
    return (
        <div className="event-preview">
            <h3>Preview</h3>
            <h4>{event.title}</h4>
            {event.image_url && (
                <img src={event.image_url} alt={event.title} style={{ maxWidth: 300, maxHeight: 200 }} />
            )}
            <p>{event.description}</p>
            <p><strong>Date/Time:</strong> {event.event_time}</p>
            <p><strong>Location:</strong> {event.location}</p>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        title: '',
        description: '',
        image_url: '',
        event_time: '',
        location: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');
        // try {
        //     const res = await API.post('/events/create', {
        //         ...form,
        //         user_id: user?.id
        //     });
        //     setSuccess('Event created!');
        //     setForm({ title: '', description: '', image_url: '', event_time: '', location: '' });
        // } catch (err) {
        //     setError('Failed to create event.');
        // } finally {
        //     setSubmitting(false);
        // }
    };

    return (
        <div className="dashboard">
            <h2>Welcome to your Dashboard</h2>
            <form className="event-form" onSubmit={handleSubmit}>
                <label>Title
                    <input name="title" value={form.title} onChange={handleChange} required />
                </label>
                <label>Image URL
                    <input name="image_url" value={form.image_url} onChange={handleChange} />
                </label>

                <label>Date & Time
                    <input name="event_time" type="datetime-local" value={form.event_time} onChange={handleChange} required />
                </label>
                <label>Location
                    <input name="location" value={form.location} onChange={handleChange} required />
                </label>
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows="4" cols="50" />
                <button type="submit" disabled={submitting}>Create Event</button>
            </form>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <EventPreview event={form} />
        </div>
    );
}
