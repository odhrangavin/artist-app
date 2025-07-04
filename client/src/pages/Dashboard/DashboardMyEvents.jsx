import { useState, useEffect } from "react";

import API from "../../api/api";
import EventCards from '../../components/UserEventsList/EventCards';

// Component to show the current user's events using /users/me/events/
function DashboardMyEvents({ onEditEvent }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [faveList, setFaveList] = useState([]);

    useEffect(() => {

        // Get list of events created by the user
        async function fetchEvents() {
            setLoading(true);
            setErr('');
            try {
                const res = await API.get(`/users/me/events`);

                const eventList = res.data.events.map(dataObject => {
                    const { user_id, ...data } = dataObject;
                    return {
                        event_user_id: user_id,
                        ...data
                    }
                })

                setEvents(eventList || []);
            } catch (e) {
                setErr('Failed to load your events.');
                setEvents([]);
            }
            setLoading(false);
        }
        fetchEvents();

        // Get list of faves made by the user
        async function fetchFaves() {
            try {
                const res = await API.get('/users/me/faves');
                setFaveList(res.data.user || []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchFaves();

    }, []);

    if (loading) return <div>Loading your events...</div>;
    if (err) return <div className="error">{err}</div>;

    return (

        <EventCards
            onEditEvent={onEditEvent}
            events={events}
            faves={faveList}
            title="My Events"

        />
    );
}

export default DashboardMyEvents;