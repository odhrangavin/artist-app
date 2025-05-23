import { useState, useEffect } from "react";
import { searchEvents, extractOptions } from "../../api/api";
import ExternalEventSearchForm from "./ExternalEventSearchForm";
import "./ExternalEventList.css";

export default function ExternalEventList() {
    const [events, setEvents] = useState([]);
    const [options, setOptions] = useState({
        cities: [],
        venuesByCity: {},
        genresByCityVenue: {},
    });
    const [loading, setLoading] = useState(false);

    // Initial load: fetch all events for options
    useEffect(() => {
        loadOptionsAndEvents({});
    }, []);

    async function loadOptionsAndEvents({ keyword,
        dateFrom,
        dateTo, city, venue, genre }) {
        setLoading(true);
        const events = await searchEvents({
            keyword,
            dateFrom,
            dateTo, city, venue, genre
        });
        setEvents(events);
        setOptions(extractOptions(events));
        setLoading(false);
    }

    function handleSearch(params) {
        loadOptionsAndEvents(params);
    }

    return (
        <div>
            <ExternalEventSearchForm
                onSearch={handleSearch}
                cityOptions={options.cities}
                venueOptions={options.venuesByCity}
                genreOptions={options.genresByCityVenue}
                loading={loading}
            />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul className="event-grid">
                    {events.length === 0 ? (
                        <li>No events found.</li>
                    ) : (
                        events.map((e) => (
                            <li key={e.id} className="event-card">
                                <img src={e.images?.[0]?.url} alt={e.name} className="event-image" />
                                <h4>{e.name}</h4>
                                <p>
                                    <strong>Date:</strong> {e.dates?.start?.localDate}
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
            )}
        </div>
    );
}