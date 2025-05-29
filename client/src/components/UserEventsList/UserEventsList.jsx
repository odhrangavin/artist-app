import { useState, useRef, useEffect } from "react";
import API from "../../api/api";
import UserEventSearchForm from "./UserEventSearchForm";

const EVENTS_PER_PAGE = 6;

// Helper to extract options for filtering/search form
function extractOptions(events) {
    const cities = [];
    const venuesByCity = {};
    const genresByCityVenue = {};

    events.forEach((e) => {
        if (e.location && !cities.includes(e.location)) {
            cities.push(e.location);
            venuesByCity[e.location] = [];
            genresByCityVenue[e.location] = {};
        }
        if (e.location && e.venue && !venuesByCity[e.location].includes(e.venue)) {
            venuesByCity[e.location].push(e.venue);
            genresByCityVenue[e.location][e.venue] = [];
        }
        if (
            e.location &&
            e.venue &&
            e.genre &&
            !genresByCityVenue[e.location][e.venue].includes(e.genre)
        ) {
            genresByCityVenue[e.location][e.venue].push(e.genre);
        }
    });

    return { cities, venuesByCity, genresByCityVenue };
}

// Helper to filter events by date range (frontend only)
function filterEventsByDate(events, { dateFrom, dateTo }) {
    // All dates are in YYYY-MM-DD format
    const today = new Date().toISOString().slice(0, 10);
    return events.filter((ev) => {
        // Exclude if event_date is missing or before today
        if (!ev.event_date || ev.event_date < today) return false;
        // If a from-date is set, only include events on/after it
        if (dateFrom && ev.event_date < dateFrom) return false;
        // If a to-date is set, only include events on/before it
        if (dateTo && ev.event_date > dateTo) return false;
        return true;
    });
}

export default function UserEventList() {
    const [events, setEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [options, setOptions] = useState({
        cities: [],
        venuesByCity: {},
        genresByCityVenue: {},
    });
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [lastSearch, setLastSearch] = useState({});
    const fullCityList = useRef([]);

    // Initial load: fetch all events for options, filter for today+
    useEffect(() => {
        loadOptionsAndEvents({}, true);
    }, []);

    async function loadOptionsAndEvents({ keyword, dateFrom, dateTo, city, venue, genre }, isInitialLoad = false) {
        setLoading(true);
        try {
            // Fetch all events (optionally filtered by city/venue/genre)
            const res = await API.get("/events", {
                params: {
                    title: keyword || undefined,
                    location: city || undefined,
                    venue: venue || undefined,
                    genre: genre || undefined,
                },
            });
            let events = res.data.results || [];
            setAllEvents(events);

            // Always filter out past events and apply frontend date range filter
            events = filterEventsByDate(events, { dateFrom, dateTo });

            // Update options for selects
            const opts = extractOptions(events);
            setEvents(events);
            setOptions(opts);
            setPage(1);
            setLastSearch({ keyword, dateFrom, dateTo, city, venue, genre });
            if (isInitialLoad) {
                fullCityList.current = opts.cities;
            }
        } catch (e) {
            setEvents([]);
        }
        setLoading(false);
    }

    function handleSearch(params) {
        loadOptionsAndEvents(params);
    }

    // Pagination logic
    const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
    const displayedEvents = events.slice(
        (page - 1) * EVENTS_PER_PAGE,
        page * EVENTS_PER_PAGE
    );

    function handlePageChange(newPage) {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <div>
            <UserEventSearchForm
                onSearch={handleSearch}
                cityOptions={fullCityList.current.length > 0 ? fullCityList.current : options.cities}
                venueOptions={options.venuesByCity}
                genreOptions={options.genresByCityVenue}
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
                                    {e.image_url && <img src={e.image_url} alt={e.title} className="event-image" />}
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
                                    <p>{e.description || "No description available"}</p>
                                    <a
                                        href={`/events/${e.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Event
                                    </a>
                                </li>
                            ))
                        )}
                    </ul>
                    {totalPages > 1 && (
                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    disabled={page === i + 1}
                                    style={{
                                        margin: "0 3px",
                                        background: page === i + 1 ? "#1a1a1a" : "#eee",
                                        color: page === i + 1 ? "#fff" : "#222",
                                        border: "none",
                                        borderRadius: "4px",
                                        padding: "6px 12px",
                                        cursor: page === i + 1 ? "default" : "pointer",
                                        fontWeight: page === i + 1 ? "bold" : "normal"
                                    }}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}