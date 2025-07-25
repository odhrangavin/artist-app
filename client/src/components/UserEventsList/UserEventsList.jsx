import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import UserEventSearchForm from "./UserEventSearchForm";
import "./UserEventsList.scss";
import Pagination from "./Pagination";
import { HeartButton } from "../../pages/Dashboard/HeartButton";
import { AttendingButton } from "../../pages/Dashboard/AttendingButton";
import { useAuth } from '../../context/AuthContext';
import EventImage from './EventImage'


// Helper to extract dropdown options from all events (not filtered!)
function extractOptions(events) {
	const cities = [];
	const venuesByCity = {};
	const allGenresSet = new Set()

	events.forEach((e) => {
		// Cities
		if (e.location && !cities.includes(e.location)) {
			cities.push(e.location);
			venuesByCity[e.location] = [];
		}
		// Venues by city
		if (e.location && e.venue && !venuesByCity[e.location].includes(e.venue)) {
			venuesByCity[e.location].push(e.venue);
		}
		// Genres (flat, global)
		if (e.genre) {
			allGenresSet.add(e.genre);
		}
	});

	return {
		cities,
		venuesByCity,
		allGenres: Array.from(allGenresSet).sort(),
	};
}

// Date filter helper
function filterEventsByDate(events, { dateFrom, dateTo }) {
	const today = new Date().toISOString().slice(0, 10);
	return events.filter((ev) => {
		if (!ev.event_date || ev.event_date < today) return false;
		if (dateFrom && ev.event_date < dateFrom) return false;
		if (dateTo && ev.event_date > dateTo) return false;
		return true;
	});
}

const EVENTS_PER_PAGE = 12;

export default function UserEventList() {
	const [events, setEvents] = useState([]);
	const [allEvents, setAllEvents] = useState([]);
	const [options, setOptions] = useState({
		cities: [],
		venuesByCity: {},
		allGenres: [],
	});
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [faveList, setFaveList] = useState([]);
	const [attendingList, setAttendingList] = useState([]);
	const fullCityList = useRef([]);
	const { isLoggedIn, user } = useAuth();
	const navigate = useNavigate();

	// Initial load: fetch all events, build dropdowns from those
	useEffect(() => {
		fetchAllEvents();
	}, []);

	// Get list of faves made by the user
	useEffect(() => {
		if (isLoggedIn) {
			async function fetchFaves() {
				try {
					const res = await API.get('/users/me/faves');
					setFaveList(res.data.user || []);

				} catch (error) {
					console.error(error);
					setFaveList([]);
				}
			};
			fetchFaves();

			async function fetchAttending() {
				try {
					const res = await API.get(`/users/me/attending`);
					setAttendingList(res.data.user || []);

				} catch (error) {
					console.error(error);
					setAttendingList([]);
				}
			};
			fetchAttending();
		}
	}, [allEvents])


	async function fetchAllEvents() {
		setLoading(true);
		try {
			const res = await API.get('/events');

			let all = res.data.results || [];

			// Only future events for dropdowns
			const futureEvents = all.filter(ev => ev.event_date && ev.event_date >= new Date().toISOString().slice(0, 10));

			setAllEvents(futureEvents);
			setOptions(extractOptions(futureEvents));
			setEvents(futureEvents); // Show all by default
			setPage(1);
			fullCityList.current = extractOptions(futureEvents).cities;
		} catch (e) {
			setEvents([]);
			setAllEvents([]);
			setOptions({ cities: [], venuesByCity: {}, allGenres: [] });
		}
		setLoading(false);
	}

	function handleSearch({ keyword, dateFrom, dateTo, city, venue, genre }) {
		// Always filter from allEvents (future events), not last filtered
		let filtered = allEvents;

		if (keyword) {
			filtered = filtered.filter(e =>
				e.title && e.title.toLowerCase().includes(keyword.toLowerCase())
			);
		}
		if (city) {
			filtered = filtered.filter(e =>
				e.location && e.location === city
			);
		}
		if (venue) {
			filtered = filtered.filter(e =>
				e.venue && e.venue === venue
			);
		}
		if (genre) {
			filtered = filtered.filter(e =>
				e.genre && e.genre === genre
			);
		}
		filtered = filterEventsByDate(filtered, { dateFrom, dateTo });

		setEvents(filtered);
		setPage(1);
		// options stay the same (from allEvents)
	}

	//Pagination logic
	const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
	const displayedEvents = events.slice(
		(page - 1) * EVENTS_PER_PAGE,
		page * EVENTS_PER_PAGE
	);

	function handlePageChange(newPage) {
		if (newPage < 1 || newPage > totalPages) return;
		setPage(newPage);
		// window.scrollTo({ top: 0, behavior: "smooth" });
	}

	const handleView = (id) => {
		navigate(`/events/${id}`);
	};

	return (
		<div>
			<UserEventSearchForm
				onSearch={handleSearch}
				cityOptions={fullCityList.current.length > 0 ? fullCityList.current : options.cities}
				venueOptions={options.venuesByCity}
				genreOptions={options.allGenres}
				loading={loading}
			/>
			{loading ? (
				<p>Loading...</p>
			) : (
				<>
					<ul className="event-grid">
						{displayedEvents.length === 0 ? (
							<li>No events found.</li>
						) : (
							displayedEvents.map((e) => (
								<li key={e.id} className="event-card">
									<div className="event-body">
										<EventImage
											imageUrl={e.image_url}
											suspended={!!e.suspended}
											eventTitle={e.title}
										/>
										<h3>{e.title}</h3>
										<p>
											<strong>Date/Time:</strong> {e.event_date} {e.event_time}
										</p>
										<p>
											<strong>City:</strong> {e.location}
										</p>
										<p>
											<strong>Venue:</strong> {e.venue}
										</p>
										<p>
											<strong>Genre:</strong> {e.genre}
										</p>
										<p className="event-description">
											{(e.info || e.description || "No description available").length > 90
												? (
													<>
														{(e.info || e.description || "No description available").slice(0, 90)}...
													</>
												)
												: (e.info || e.description || "No description available")
											}
										</p>
									</div>
									<div className="event-actions">
										<button
											type="button"
											className="event-action-btn event-view-btn"
											style={{ color: "#646cff" }}
											onClick={() => handleView(e.id)}
										>
											View Event
										</button>
										{isLoggedIn && (
											<>
												<HeartButton
													eventId={e.id}
													faveObject={faveList.find(fave => fave.event == e.id)}
												/>
												{user.id !== e.user_id &&
													<AttendingButton
														eventId={e.id}
														attendObject={attendingList.find(attend => attend.event === e.id)}
													/>
												}
											</>
										)}

									</div>
								</li>
							))
						)}
					</ul>
					<Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
				</>
			)}
		</div>
	);
}
