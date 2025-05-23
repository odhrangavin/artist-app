import './ExternalEventList.css';

import { useState } from "react";
import AutocompleteInput from "./AutocompleteInput";

// today-YYYY-MM-DD
function getTodayISO() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

export default function ExternalEventSearchForm({
    onSearch,
    cityOptions,
    venueOptions,
    genreOptions,
    loading,
}) {
    const [keyword, setKeyword] = useState("");
    const [dateFrom, setDateFrom] = useState(getTodayISO());
    const [dateTo, setDateTo] = useState("");
    const [city, setCity] = useState("");
    const [venue, setVenue] = useState("");
    const [genre, setGenre] = useState("");


    function handleClear() {
        setKeyword("");
        setDateFrom(getTodayISO());
        setDateTo("");
        setCity("");
        setVenue("");
        setGenre("");
        onSearch({
            keyword: "",
            dateFrom: getTodayISO(),
            dateTo: "",
            city: "",
            venue: "",
            genre: "",
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSearch({
            keyword,
            dateFrom,
            dateTo,
            city,
            venue,
            genre,
        });
    }

    // Venue options only for selected city, otherwise empty list
    const venues = city && venueOptions[city] ? venueOptions[city] : [];
    // Genre options only for selected city & venue, otherwise empty list
    const genres =
        city && venue && genreOptions[`${city}|||${venue}`]
            ? genreOptions[`${city}|||${venue}`]
            : [];

    return (
        <form
            className="external-event-search"
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Artist or Event name"
            />
            <input
                type="date"
                value={dateFrom}
                min={getTodayISO()}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From"
            />
            <input
                type="date"
                value={dateTo}
                min={dateFrom || getTodayISO()}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To"
            />

            <AutocompleteInput
                value={city}
                onChange={v => {
                    setCity(v);
                    setVenue("");
                    setGenre("");
                }}
                suggestions={cityOptions}
                placeholder="City"
                onClear={() => {
                    setCity("");
                    setVenue("");
                    setGenre("");
                }}
                disabled={loading}
            />
            <AutocompleteInput
                value={venue}
                onChange={v => {
                    setVenue(v);
                    setGenre("");
                }}
                suggestions={venues}
                placeholder="Venue"
                onClear={() => {
                    setVenue("");
                    setGenre("");
                }}
                disabled={loading}
            />
            <AutocompleteInput
                value={genre}
                onChange={setGenre}
                suggestions={genres}
                placeholder="Genre"
                onClear={() => setGenre("")}
                disabled={loading}
            />
            <button type="submit" disabled={loading}>
                Search
            </button>
            <button type="button" onClick={handleClear} disabled={loading}>
                Clear
            </button>
        </form>
    );
}