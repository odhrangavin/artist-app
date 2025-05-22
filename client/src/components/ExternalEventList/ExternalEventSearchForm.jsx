import { useState, useMemo } from "react";
import AutocompleteInput from "./AutocompleteInput";

// today-YYYY-MM-DD
function getTodayISO() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

export default function ExternalEventSearchForm({
    onSearch,
    citySuggestions,
    venueSuggestions,
    genreSuggestions,
    loading,
}) {
    const [keyword, setKeyword] = useState("");
    const [dateFrom, setDateFrom] = useState(getTodayISO());
    const [dateTo, setDateTo] = useState("");
    const [city, setCity] = useState("");
    const [venue, setVenue] = useState("");
    const [genre, setGenre] = useState("");

    // Clear all fields
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

    return (
        <form
            className="external-event-search"
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1rem",
                flexWrap: "wrap",
                alignItems: "flex-end",
            }}
        >
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Keyword"
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
                onChange={setCity}
                suggestions={citySuggestions}
                placeholder="City"
                onClear={() => setCity("")}
            />
            <AutocompleteInput
                value={venue}
                onChange={setVenue}
                suggestions={venueSuggestions}
                placeholder="Venue"
                onClear={() => setVenue("")}
            />
            <AutocompleteInput
                value={genre}
                onChange={setGenre}
                suggestions={genreSuggestions}
                placeholder="Genre"
                onClear={() => setGenre("")}
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