import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/api';
import './UserEventsList.css';

export default function UserEventDetail() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchEvent() {
            setLoading(true);
            setError('');
            try {
                const res = await API.get(`/events/${id}`);
                setEvent(res.data.event || res.data);
            } catch (e) {
                setError('Could not load event.');
            }
            setLoading(false);
        }
        fetchEvent();
    }, [id]);

    if (loading) return <div>Loading event...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!event) return <div>Event not found.</div>;

    return (
        <div className="event-detail" role="region" aria-label="Event detail">
            <h2>{event.title}</h2>
            {event.image_url && <img className='event-detail-image' src={event.image_url} alt={event.title} />}
            {event.description && <p><strong>Description:</strong> {event.description}</p>}
            <p><strong>Date/Time:</strong> {event.event_date} {event.event_time}</p>
            <p><strong>City:</strong> {event.location}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Genre:</strong> {event.genre}</p>
            <p><strong>Author:</strong> {event.author}</p>
        </div>
    );
}