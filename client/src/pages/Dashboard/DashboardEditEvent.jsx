import { useState, useEffect } from "react";
import API from "../../api/api";

export default function DashboardEditEvent({ eventId, onBack }) {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [suspendLoading, setSuspendLoading] = useState(false);

    function getNowLocalISO() {
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const yyyy = now.getFullYear();
        const MM = pad(now.getMonth() + 1);
        const dd = pad(now.getDate());
        const hh = pad(now.getHours());
        const mm = pad(now.getMinutes());
        return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
    }

    function makeDateTimeLocal(date, time) {
        if (!date || !time) return '';
        if (time.includes('T')) return time;
        // Handles if time is "17:00" or "17:00:00"
        return `${date}T${time.slice(0, 5)}`;
    }

    useEffect(() => {
        async function fetchEvent() {
            setLoading(true);
            setError("");
            try {
                const res = await API.get(`/events/${eventId}`);
                const event = res.data.event;
                event.event_time = makeDateTimeLocal(event.event_date, event.event_time);
                setForm(event);
            } catch {
                setError("Failed to load event.");
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [eventId]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await API.put(`/events/${eventId}`, form);
            setSuccess("Event updated!");
            setTimeout(() => {
                setSuccess("");
                onBack();
            }, 1200);
        } catch {
            setError("Failed to update event.");
        }
    }

    // --- SUSPEND/UNSUSPEND LOGIC ---
    async function handleSuspendToggle() {
        if (!form) return;
        setSuspendLoading(true);
        setError("");
        setSuccess("");
        try {
            const newSuspended = !form.suspended;
            await API.patch(`/events/${eventId}`, { suspended: newSuspended });
            setForm(prev => ({ ...prev, suspended: newSuspended }));
            setSuccess(newSuspended ? "Event suspended!" : "Event unsuspended!");
        } catch {
            setError("Failed to update suspension status.");
        }
        setSuspendLoading(false);
    }

    if (loading) return <div>Loading event...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!form) return null;

    return (
        <section className="event-edit-section">
            <h2>Edit Event</h2>
            {!!form.suspended && (
                <div style={{
                    background: "#c00", color: "#fff", fontWeight: "bold",
                    fontSize: "2em", padding: "0.3em 0.8em", borderRadius: 8,
                    marginBottom: "1em", textAlign: "center"
                }}>
                    Suspended
                </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
                {form.image_url && (
                    <div style={{ position: "relative", display: "inline-block" }}>
                        {!!form.suspended && (
                            <div style={{
                                position: "absolute",
                                top: 10,
                                left: "50%",
                                transform: "translateX(-50%)",
                                background: "#c00",
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "1.5em",
                                padding: "0.3em 1.2em",
                                borderRadius: 8,
                                zIndex: 2,
                                opacity: 0.92,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                pointerEvents: "none"
                            }}>
                                Suspended
                            </div>
                        )}
                        <img
                            className="event-detail-image"
                            src={form.image_url}
                            alt={form.title}
                            style={{ maxWidth: 260, borderRadius: 8 }}
                        />
                    </div>
                )}
            </div>
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
                        value={form.event_time}
                        min={getNowLocalISO()}
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
                <label>Description
                    <textarea name="description" value={form.description || ""} onChange={handleChange} required rows="4" maxLength={400} />
                </label>
                <button type="submit" className="event-submit-btn">Update Event</button>
                {success && <div className="success">{success}</div>}
                {error && <div className="error">{error}</div>}
            </form>
            <button
                className="event-action-btn"
                onClick={handleSuspendToggle}
                disabled={suspendLoading}
                style={{
                    margin: "1em 0",
                    background: form.suspended ? "#999" : "#c00",
                    color: "#fff",
                    fontWeight: "bold"
                }}
            >
                {form.suspended ? "Unsuspend Event" : "Suspend Event"}
            </button>
            <button className="event-action-btn" onClick={onBack}>Back to My Events</button>
        </section>
    );
}