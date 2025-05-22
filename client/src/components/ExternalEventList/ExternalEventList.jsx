import { useState, useEffect } from "react";
import { searchEvents, getEventSuggestions } from "../../api/api";
import ExternalEventSearchForm from "./ExternalEventSearchForm";
import "./ExternalEventList.css";

function getTodayISO() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

export default function ExternalEventList() {
    const [events, setEvents] = useState([]);
    const [suggestions, setSuggestions] = useState({
        cities: [],
        venues: [],
        genres: [],
    });
    const [loading, setLoading] = useState(false);

    // Default search
    useEffect(() => {
        handleSearch({
            keyword: "",
            dateFrom: getTodayISO(),
            dateTo: "",
            city: "",
            venue: "",
            genre: "",
        });
        // eslint-disable-next-line
    }, []);

    async function handleSearch({
        keyword,
        dateFrom,
        dateTo,
        city,
        venue,
        genre,
    }) {
        setLoading(true);
        const startDateTime =
            dateFrom && dateFrom >= getTodayISO() ? `${dateFrom}T00:00:00Z` : "";
        const endDateTime =
            dateTo && dateTo >= dateFrom ? `${dateTo}T23:59:59Z` : "";
        try {
            const results = await searchEvents({
                keyword,
                city,
                venueName: venue,
                classificationName: genre,
                startDateTime,
                endDateTime,
                size: 30,
            });
            setEvents(results);
            setSuggestions(getEventSuggestions(results));
        } catch (e) {
            setEvents([]);
            setSuggestions({ cities: [], venues: [], genres: [] });
        }
        setLoading(false);
    }

    return (
        <div>
            <ExternalEventSearchForm
                onSearch={handleSearch}
                citySuggestions={suggestions.cities}
                venueSuggestions={suggestions.venues}
                genreSuggestions={suggestions.genres}
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
                                <img src={e.image} alt={e.name} className="event-image" />
                                <h4>{e.name}</h4>
                                <p>
                                    <strong>Date:</strong> {e.date}{" "}
                                    {e.time ? <span>{e.time}</span> : null}
                                </p>
                                <p>
                                    <strong>City:</strong> {e.city}
                                </p>
                                <p>
                                    <strong>Venue:</strong> {e.venue}
                                </p>
                                <p>
                                    <strong>Genre:</strong> {e.genre}
                                </p>
                                <p>{e.description}</p>
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