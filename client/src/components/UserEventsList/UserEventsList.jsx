import { useEffect, useState } from 'react';
import API from '../../api/api';

export default function UserEventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchEvents() {
            setLoading(true);
            setError('');
            try {
                const res = await API.get('/events');
                setEvents(res.data.results || []);
            } catch (e) {
                setError('Could not load events.');
                setEvents([]);
            }
            setLoading(false);
        }
        fetchEvents();
    }, []);

    if (loading) return <div>Loading events...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <section className="events-section">
            <h2>Your Events</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {events.map(ev => (
                    <li key={ev.id} className="event-card" style={{ marginBottom: '2rem', border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
                        <h3>{ev.title}</h3>
                        {ev.image_url && (
                            <img src={ev.image_url} alt={ev.title} style={{ maxWidth: 200, display: 'block', marginBottom: 8 }} />
                        )}
                        {ev.description && <p><strong>Description:</strong> {ev.description}</p>}
                        <p><strong>Date/Time:</strong> {ev.event_time}</p>
                        <p><strong>Location:</strong> {ev.location}</p>
                        <p><strong>Venue:</strong> {ev.venue}</p>
                        <p><strong>Genre:</strong> {ev.genre}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}