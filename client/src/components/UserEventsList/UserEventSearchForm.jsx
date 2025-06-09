import { useState } from "react";
import "./UserEventsList.css";

export default function UserEventSearchForm({
    onSearch,
    cityOptions,
    venueOptions,
    genreOptions,
    loading,
}) {
    const today = new Date().toISOString().slice(0, 10);
    const [keyword, setKeyword] = useState("");
    const [dateFrom, setDateFrom] = useState(today);
    const [dateTo, setDateTo] = useState("");
    const [city, setCity] = useState("");
    const [venue, setVenue] = useState("");
    const [genre, setGenre] = useState("");


    const sortedCities = [...cityOptions].sort((a, b) => a.localeCompare(b));
    const sortedGenres = [...genreOptions].sort((a, b) => a.localeCompare(b));
    const sortedVenues = city && venueOptions[city]
        ? [...venueOptions[city]].sort((a, b) => a.localeCompare(b))
        : [];

    function handleSubmit(e) {
        e.preventDefault();
        onSearch({ keyword, dateFrom, dateTo, city, venue, genre });
    }

    function handleClear() {
        setKeyword("");
        setDateFrom(today);
        setDateTo("");
        setCity("");
        setVenue("");
        setGenre("");
        onSearch({ keyword: "", dateFrom: today, dateTo: "", city: "", venue: "", genre: "" });
    }

    function handleCityChange(e) {
        setCity(e.target.value);
        setVenue("");
    }

    function handleVenueChange(e) {
        setVenue(e.target.value);
    }

    return (
        <form onSubmit={handleSubmit} className="user-event-search-form">
            <input
                type="text"
                name="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Event title"
                aria-label="Event title"
            />
            <input
                type="date"
                name="dateFrom"
                value={dateFrom}
                min={today}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From date"
                aria-label="From date"
            />
            <input
                name="dateTo"
                type="date"
                value={dateTo}
                min={dateFrom}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To date"
                aria-label="To date"
            />
            <select
                name="city"
                value={city}
                onChange={handleCityChange}
                aria-label="Select a city"
            >
                <option value="">All cities</option>
                {sortedCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
            <select
                name="venue"
                value={venue}
                onChange={handleVenueChange}
                disabled={!city}
                aria-label="Select a venue"
            >
                <option value="">All venues</option>
                {city && venueOptions[city]
                    ? venueOptions[city].map((v) => (
                        <option key={v} value={v}>{v}</option>
                    ))
                    : null}
            </select>
            <select
                name="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                aria-label="Select a genre"
            >
                <option value="">All genres</option>
                {genreOptions.map((g) => (
                    <option key={g} value={g}>{g}</option>
                ))}
            </select>
            <div className="search-actions">
                <button type="submit" disabled={loading}>Search</button>
                <button type="button" onClick={handleClear} disabled={loading}>Clear</button>
            </div>
        </form>
    );
}