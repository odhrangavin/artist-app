import { useEffect, useState } from 'react';
import API from '../../api/api';
import './UserEventsList.css'; // Assuming you have some styles for the component

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
            <ul className='event-grid'>
                {events.map(ev => (
                    <li key={ev.id} className="event-card">
                        {ev.image_url && (
                            <img className='event-image' src={ev.image_url} alt={ev.title} />
                        )}
                        <h3>{ev.title}</h3>
                        {ev.description && <p><strong>Description:</strong> {ev.description}</p>}
                        <p><strong>Date/Time:</strong> {ev.event_time}</p>
                        <p><strong>City:</strong> {ev.location}</p>
                        <p><strong>Venue:</strong> {ev.venue}</p>
                        <p><strong>Genre:</strong> {ev.genre}</p>
                        <a className='event-link' href={`events/${ev.id}`}
                            target="_blank" rel="noopener noreferrer">
                            View Event
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}