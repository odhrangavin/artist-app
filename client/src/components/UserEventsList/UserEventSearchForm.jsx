import { useState } from "react";

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

    function handleSubmit(e) {
        e.preventDefault();
        onSearch({ keyword, dateFrom, dateTo, city, venue, genre });
    }

    function handleCityChange(e) {
        setCity(e.target.value);
        setVenue("");
        setGenre("");
    }

    function handleVenueChange(e) {
        setVenue(e.target.value);
        setGenre("");
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Event title"
            />
            <input
                type="date"
                value={dateFrom}
                min={today}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From date"
            />
            <input
                type="date"
                value={dateTo}
                min={dateFrom}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To date"
            />
            <select value={city} onChange={handleCityChange}>
                <option value="">All cities</option>
                {cityOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
            <select value={venue} onChange={handleVenueChange} disabled={!city}>
                <option value="">All venues</option>
                {city && venueOptions[city]
                    ? venueOptions[city].map((v) => (
                        <option key={v} value={v}>{v}</option>
                    ))
                    : null}
            </select>
            <select value={genre} onChange={(e) => setGenre(e.target.value)} disabled={!city || !venue}>
                <option value="">All genres</option>
                {city && venue && genreOptions[city] && genreOptions[city][venue]
                    ? genreOptions[city][venue].map((g) => (
                        <option key={g} value={g}>{g}</option>
                    ))
                    : null}
            </select>
            <button type="submit" disabled={loading}>Search</button>
        </form>
    );
}