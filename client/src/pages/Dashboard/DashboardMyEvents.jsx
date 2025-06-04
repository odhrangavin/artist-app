import { useState, useEffect } from "react";

import API from "../../api/api";
<<<<<<< HEAD
import EventCards from '../../components/UserEventsList/EventCards';
=======
import { useNavigate } from "react-router-dom"; // For navigation
>>>>>>> main

// Component to show the current user's events using /users/me/events/
function DashboardMyEventsList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
<<<<<<< HEAD
		const [faveList, setFaveList] = useState([]);
=======
    const navigate = useNavigate();
>>>>>>> main

    useEffect(() => {
			
			// Get list of events created by the user
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
			
			// Get list of faves made by the user
			const fetchFaves = async () => {
				try {
					const res = await API.get('/users/me/faves');
					setFaveList(res.data.user);
				} catch (error) {
					console.error(error);
				}
			};
			fetchFaves();

    }, []);

    const handleView = (id) => {
        navigate(`/events/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/dashboard/events/edit/${id}`);
    };

    if (loading) return <div>Loading your events...</div>;
    if (err) return <div className="error">{err}</div>;
    
    return (
			<EventCards events={events} faves={faveList} title="My Events" />
    );
}

export default DashboardMyEventsList;