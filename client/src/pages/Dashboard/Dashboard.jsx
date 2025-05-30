import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/api';

import './Dashboard.scss';

// Component to preview the event before submitting
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

// Component to show the current user's events
function UserEventsList({ userId }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        async function fetchEvents() {
            setLoading(true);
            setErr('');
            try {
                // Prefer dedicated route, fallback to all events filtered client-side if not available
                const res = await API.get(`/events/user/${userId}`);
                setEvents(res.data.events);
            } catch (e) {
                setErr('Failed to load your events.');
                setEvents([]);
            }
            setLoading(false);
        }
        if (userId) fetchEvents();
    }, [userId]);

    if (loading) return <div>Loading your events...</div>;
    if (err) return <div className="error">{err}</div>;
    if (!events.length) return <div>No events posted yet.</div>;

    return (
        <section className="user-events-list">
            <h3>Your Events</h3>
            <ul>
                {events.map(ev => (
                    <li key={ev.id} className="event-card">
                        {ev.image_url && (
                            <img src={ev.image_url} alt={ev.title} style={{ maxWidth: 220, maxHeight: 130 }} />
                        )}
                        <h4>{ev.title}</h4>
                        <p>{ev.description}</p>
                        <p><strong>Date/Time:</strong> {ev.event_time}</p>
                        <p><strong>Location:</strong> {ev.location}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        title: '',
        description: '',
        image_url: '',
        event_time: '',
        location: '',
        venue: '',
        genre: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // To refresh event list after creating a new event
    const [refreshKey, setRefreshKey] = useState(0);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            await API.post('/events', {
                ...form,
                user_id: user?.id
            });
            setSuccess('Event created!');
            setForm({ title: '', description: '', image_url: '', event_time: '', location: '', venue: '', genre: '' });
            setRefreshKey(k => k + 1); // trigger event list reload
        } catch (err) {
            setError('Failed to create event.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="dashboard">
            <h2>Welcome to your Dashboard</h2>
            <div className="dashboard-container">
                <form className="event-form" onSubmit={handleSubmit}>
                    <h3>Create Your Event</h3>
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
                    <label>Venue
                        <input name="venue" value={form.venue} onChange={handleChange} required />
                    </label>
                    <label>Genre
                        <input name="genre" value={form.genre} onChange={handleChange} required />
                    </label>
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} required rows="4" cols="50" />
                    <button type="submit" disabled={submitting}>Create Event</button>
                </form>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <div><EventPreview event={form} /></div>
            </div>
        </section>
    );
}