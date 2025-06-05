import { useState, useEffect } from "react";

import API from "../../api/api";
import EventCards from '../../components/UserEventsList/EventCards';

export default function DashboardFavorites() {

	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState('');
	const [faveList, setFaveList] = useState([]);

	// Get list of events created by the user
	const refreshFavorites = async () =>  {
		setLoading(true);
		setErr('');
		try {
			const res = await API.get(`/users/me/faves/full`);

			// Normalize data for events
			const eventList = res.data.user.map(dataObject => {
					const { id, event, ...data } = dataObject;
					const modData = {
						...data,
						id: event,
						event: id
					}
					return modData
				}
			)

			setEvents(eventList || []);
			setFaveList(res.data.user || []);

		} catch (e) {
			setErr('Failed to load events.');
			setEvents([]);
		}
		setLoading(false);
	}

	// Refresh event list in first render
	useEffect(() => {
		refreshFavorites();
	}, []);

	if (loading) return <div>Loading your events...</div>;
	if (err) return <div className="error">{err}</div>;
    
	return( 
		<EventCards 
			events={events}	
			faves={faveList}
			title="My Favorite Events" 
			noEvent="You have no event in your faves."
			onFaveRemoved={refreshFavorites}
		/>

	);
}
