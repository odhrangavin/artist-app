import { useState, useEffect } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom"; // For navigation

// Component to show the current user's events using /users/me/events/
function DashboardMyEvents({ onEditEvent }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const navigate = useNavigate();

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

    const handleView = (id) => {
        navigate(`/events/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/dashboard/events/${id}`);
    };

    if (loading) return <div>Loading your events...</div>;
    if (err) return <div className="error">{err}</div>;
    if (!events.length) return <div>No events posted yet.</div>;

    return (
        <section className="user-events-list">
            <h3>Your Events</h3>
            <ul className="event-grid">
                {events.map(ev => (
                    <li key={ev.id} className="event-card">
                        {ev.image_url && (
                            <div style={{ position: "relative", display: "inline-block" }}>
                                {(!!ev.suspended) && (
                                    <div style={{
                                        position: "absolute",
                                        top: 10,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background: "#c00",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: "1.3em",
                                        padding: "0.3em 1.2em",
                                        borderRadius: 8,
                                        zIndex: 2,
                                        opacity: 0.92,
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                        pointerEvents: "none"
                                    }}>
                                        Suspended
                                    </div>
                                )}
                                <img src={ev.image_url} alt={ev.title} style={{ maxWidth: 220, maxHeight: 130, borderRadius: 6 }} />
                            </div>
                        )}
                        <h4>{ev.title}</h4>
                        <p>{ev.description}</p>
                        <p><strong>Date:</strong> {ev.event_date}</p>
                        <p><strong>Time:</strong> {ev.event_time}</p>
                        <p><strong>Location:</strong> {ev.location}</p>
                        <p><strong>Venue:</strong> {ev.venue}</p>
                        <p><strong>Genre:</strong> {ev.genre}</p>
                        <div className="event-card-actions" style={{ marginTop: "0.7em", display: "flex", gap: "0.7em" }}>
                            <button
                                type="button"
                                className="event-action-btn event-view-btn"
                                onClick={() => handleView(ev.id)}
                            >
                                View Event
                            </button>
                            <div className="event-card-actions">
                                <button
                                    type="button"
                                    className="event-action-btn event-edit-btn"
                                    onClick={() => onEditEvent(ev.id)}
                                >
                                    Edit Event
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default DashboardMyEvents;