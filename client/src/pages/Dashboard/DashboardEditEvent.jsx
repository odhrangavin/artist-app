import { useState, useEffect } from "react";
import API from "../../api/api";

export default function DashboardEditEvent({ eventId, onBack }) {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function fetchEvent() {
            try {
                const res = await API.get(`/events/${eventId}`);
                setForm(res.data.event);
            } catch (e) {
                setError("Failed to load event.");
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [eventId]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await API.put(`/events/${eventId}`, form);
            setSuccess("Event updated!");
            setTimeout(() => {
                setSuccess("");
                onBack();
            }, 1200);
        } catch (e) {
            setError("Failed to update event.");
        }
    };

    if (loading) return <div>Loading event...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!form) return null;

    return (
        <section className="event-edit-section">
            <h2>Edit Event</h2>
            <form className="event-form" onSubmit={handleSubmit}>
                <label>Title
                    <input name="title" value={form.title || ""} onChange={handleChange} required maxLength={60} />
                </label>
                <label>Image URL
                    <input name="image_url" value={form.image_url || ""} onChange={handleChange} />
                </label>
                <label>Date & Time
                    <input
                        name="event_time"
                        type="datetime-local"
                        value={form.event_time ? form.event_time.substring(0, 16) : ""}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>Location
                    <input name="location" value={form.location || ""} onChange={handleChange} required />
                </label>
                <label>Venue
                    <input name="venue" value={form.venue || ""} onChange={handleChange} required />
                </label>
                <label>Genre
                    <input name="genre" value={form.genre || ""} onChange={handleChange} required />
                </label>
                <label>Description</label>
                <textarea name="description" value={form.description || ""} onChange={handleChange} required rows="4" maxLength={400} />
                <button type="submit" className="event-submit-btn">Update Event</button>
                {success && <div className="success">{success}</div>}
                {error && <div className="error">{error}</div>}
            </form>
            <button className="event-action-btn" style={{ marginTop: "1em" }} onClick={onBack}>Back to My Events</button>
        </section>
    );
}