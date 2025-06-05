import { useState, useEffect, useRef } from "react";
// import { searchEvents, extractOptions } from "../../api/api";
// import ExternalEventSearchForm from "./ExternalEventSearchForm";
import "./ExternalEventList.css";

const EVENTS_PER_PAGE = 6;

export default function ExternalEventList() {
    const [events, setEvents] = useState([]);
    const [options, setOptions] = useState({
        cities: [],
        venuesByCity: {},
        genresByCityVenue: {},
    });
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    // Store the initial full city list
    const fullCityList = useRef([]);

    // Initial load: fetch all events for options
    useEffect(() => {
        loadOptionsAndEvents({}, true);
    }, []);

    async function loadOptionsAndEvents({ keyword, dateFrom, dateTo, city, venue, genre }, isInitialLoad = false) {
        setLoading(true);
        const events = await searchEvents({
            keyword,
            startDateTime: dateFrom ? `${dateFrom}T00:00:00Z` : '',
            endDateTime: dateTo ? `${dateTo}T23:59:59Z` : '',
            city,
            venue,
            genre
        });
        const opts = extractOptions(events);
        setEvents(events);
        setOptions(opts);
        setPage(1);
        // On initial load, store full city list
        if (isInitialLoad) {
            fullCityList.current = opts.cities;
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
        window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: scroll to top on page change
    }

    return (
        <div>
            <ExternalEventSearchForm
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
                                    <img src={e.images?.[0]?.url} alt={e.name} className="event-image" />
                                    <h3>{e.name}</h3>
                                    <p>
                                        <strong>Date/Time:</strong> {e.dates?.start?.localDate}
                                        {e.dates?.start?.localTime ? <span> {e.dates.start.localTime}</span> : null}
                                    </p>
                                    <p>
                                        <strong>City:</strong> {e._embedded?.venues?.[0]?.city?.name}
                                    </p>
                                    <p>
                                        <strong>Venue:</strong> {e._embedded?.venues?.[0]?.name}
                                    </p>
                                    <p>
                                        <strong>Genre:</strong> {e.classifications?.[0]?.genre?.name}
                                    </p>
                                    <p>{e.info || "No description available"}</p>
                                    <a
                                        href={e.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Event
                                    </a>
                                </li>
                            ))
                        )}
                    </ul>
                </>
            )}
        </div>
    );
}