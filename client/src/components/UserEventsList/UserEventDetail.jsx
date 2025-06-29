import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, redirect } from 'react-router-dom';
import API from '../../api/api';
import './UserEventsList.scss';
import EventImage from "./EventImage";


export default function UserEventDetail() {
	const { id } = useParams();
	const navigate = useNavigate()

	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [userMap, setUserMap] = useState({});
	const [attendanceNumber, setAttendanceNumber] = useState('');
	const [attendantsMsg, setAttendantsMsg] = useState('');

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


	// Fetch users
	useEffect(() => {
		async function fetchUsers() {
			try {
				const res = await API.get('/users');
				// user_id -> username map
				const map = {};
				(res.data.users || res.data).forEach(u => {
						map[u.id] = u.username;
				});
				setUserMap(map);
			} catch (e) {
				console.error('Could not load users:', e);
			}
		}

		if (event && !event.username) {
			fetchUsers();
		}
	}, [event]);

	useEffect(() => {
		async function fetchAttendance() {
			try {
				const res = await API.get(`/events/${event.id}/attendance`);
				setAttendanceNumber(res.data.attendance);
			} catch (e) {
				console.error('Could not load attendance', e);
			}
		}

		if (event && !event.username) {
			fetchAttendance();
		}
	}, [event]);

	useEffect(() => {
			if (attendanceNumber === 0) {
				setAttendantsMsg(
					'Be the first Event App user to join this event!'
				)
			} else if (attendanceNumber === 1) {
				setAttendantsMsg(`${attendanceNumber} Event App user is attending.`)
			} else {
				setAttendantsMsg(`${attendanceNumber} Event App users are attending.`)    
			}
	}, [attendanceNumber])

	if (loading) return <div>Loading event...</div>;
	if (error) return <div className="error">{error}</div>;
	if (!event) return <div>Event not found.</div>;

	let author = event.username;

	if (!author && event.user_id && userMap[event.user_id]) {
		author = userMap[event.user_id];
	}

	return (
		<div className="event-detail" role="region" aria-label="Event detail">
			<h2>{event.title}</h2>
			<EventImage imageUrl={event.image_url} suspended={!!event.suspended} 
			eventTitle={event.title} imgClassName='event-detail-image' />
			<small>{attendantsMsg}</small>
			{event.description && <p className='event-detail-description'>
				<strong>Description:</strong> {event.description}
			</p>}
			<p><strong>Date/Time:</strong> {event.event_date} {event.event_time}</p>
			<p><strong>City:</strong> {event.location}</p>
			<p><strong>Venue:</strong> {event.venue}</p>
			<p><strong>Genre:</strong> {event.genre}</p>
			<p><strong>Author:</strong> {author ? author : 'Unknown'}</p>
			<button className="back-btn" onClick={() => navigate(-1)}>Go Back</button>
		</div>
	);
}