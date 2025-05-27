import { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/api';
import { useAuth } from './AuthContext';

const EventsContext = createContext();

export function EventsProvider({ children }) {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchEvents = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await API.get(`/events/user/${user.id}`);
            setEvents(res.data.events);
        } catch (e) {
            setEvents([]);
        }
        setLoading(false);
    };

    useEffect(() => { fetchEvents(); }, [user]);

    return (
        <EventsContext.Provider value={{ events, fetchEvents, loading }}>
            {children}
        </EventsContext.Provider>
    );
}

export function useEvents() {
    return useContext(EventsContext);
}