import { useState, useEffect } from 'react';
import { searchEvents } from '../api/api';
import './ExternalEventList.css';

export default function ExternalEventList() {
    const [events, setEvents] = useState([]);
    const [keyword, setKeyword] = useState('tech');
    const [loading, setLoading] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const results = await searchEvents(keyword);
            setEvents(results);
        } catch (err) {
            console.error('Failed to fetch events:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div>
            <h3>Public Events</h3>
            <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Search events..."
            />
            <button onClick={fetchEvents}>Search</button>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul className="event-grid">
                    {events.map(e => (
                        <li key={e.id} className="event-card">
                            <img src={e.image} alt={e.name} className="event-image" />
                            <h4>{e.name}</h4>
                            <p><strong>Date:</strong> {e.date}</p>
                            <p><strong>Venue:</strong> {e.venue}</p>
                            <p>{e.description}</p>
                            <a href={e.url} target="_blank" rel="noopener noreferrer">View Event</a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
