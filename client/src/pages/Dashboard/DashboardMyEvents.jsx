import { useState, useEffect } from "react";
import API from "../../api/api";

// Component to show the current user's events using /users/me/events/
function DashboardMyEventsList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        async function fetchEvents() {
            setLoading(true);
            setErr('');
            try {
                const res = await API.get(`/users/me/events/`);
                setEvents(res.data.events || []);
            } catch (e) {
                setErr('Failed to load your events.');
                setEvents([]);
            }
            setLoading(false);
        }
        fetchEvents();
    }, []);

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
                        <p><strong>Date:</strong> {ev.event_date}</p>
                        <p><strong>Time:</strong> {ev.event_time}</p>
                        <p><strong>Location:</strong> {ev.location}</p>
                        <p><strong>Venue:</strong> {ev.venue}</p>
                        <p><strong>Genre:</strong> {ev.genre}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default DashboardMyEventsList;