import { useState, useEffect, useRef } from "react";
import API from "../../api/api";
import { EventPreview } from "./DashboardCreateEvent";

const genres = [
    "Alternative", "Blues", "Children's Theatre", "Circus & Specialty Acts", "Classical", "Comedy",
    "Community/Civic", "Country", "Dance", "Dance/Electronic", "Equestrian", "Fairs & Festivals", "Family",
    "Fitness", "Folk", "Football", "Hip-Hop/Rap", "Jazz", "Latin", "Lecture/Seminar", "Metal", "Miscellaneous",
    "Miscellaneous Theatre", "Music", "Pop", "R&B", "Reggae", "Rock", "Rugby", "Soccer", "Theatre",
    "Variety", "World", "Wrestling", "Other"
];

export default function DashboardEditEvent({ eventId, onBack }) {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [suspendLoading, setSuspendLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef(null);

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
                setImagePreview(""); // no preview for now
                setImageFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
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
        if (name === "image_url") {
            setImageFile(null);
            setImagePreview("");
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setForm(prev => ({ ...prev, image_url: "" }));
        }
    }

    function handleImageDrop(file) {
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setForm(prev => ({ ...prev, image_url: "" }));
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    function handleClearImage() {
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        let imageUrlToSave = form.image_url;
        if (imageFile) {
            try {
                const uploadData = new FormData();
                uploadData.append('file', imageFile);
                const res = await API.post('/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrlToSave = res.data.url;
            } catch {
                setError('Image upload failed.');
                return;
            }
        }
        try {
            await API.put(`/events/${eventId}`, { ...form, image_url: imageUrlToSave });
            setSuccess("Event updated!");
            setImageFile(null);
            setImagePreview('');
            if (fileInputRef.current) fileInputRef.current.value = "";
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
                {(imagePreview || form.image_url) && (
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
                            src={imagePreview || form.image_url}
                            alt={form.title}
                            style={{ maxWidth: 260, borderRadius: 8 }}
                        />
                    </div>
                )}
            </div>
            <form className="event-form" onSubmit={handleSubmit}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={e => {
                    e.preventDefault(); e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleImageDrop(e.dataTransfer.files[0]);
                    }
                }}
            >
                <label>Title
                    <input name="title" value={form.title || ""} onChange={handleChange} required maxLength={60} />
                </label>
                <label>Image URL
                    <input name="image_url" value={form.image_url || ""} onChange={handleChange} />
                </label>
                <label>
                    Or upload image:
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ marginTop: 8, marginBottom: 8 }}
                    />
                    {imageFile && (
                        <span style={{ display: "inline-flex", alignItems: "center", marginLeft: 8 }}>
                            <span style={{ color: "#2474e5", fontWeight: 500, marginRight: 4 }}>
                                {imageFile.name}
                            </span>
                            <button
                                type="button"
                                aria-label="Remove attached image"
                                onClick={handleClearImage}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#c00",
                                    fontWeight: "bold",
                                    fontSize: "1.3em",
                                    cursor: "pointer"
                                }}
                            >
                                ×
                            </button>
                        </span>
                    )}
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
                    <select name="genre" value={form.genre || ""} onChange={handleChange} required>
                        {genres.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </label>
                <label>Description
                    <textarea name="description" value={form.description || ""} onChange={handleChange} required rows="4" maxLength={400} />
                </label>
                {/* Live event preview */}
                <div style={{ margin: "1.5em 0" }}>
                    <EventPreview
                        event={{ ...form, image_url: form.image_url }}
                        imagePreview={imagePreview}
                        onClearImage={handleClearImage}
                        onImageDrop={handleImageDrop}
                    />
                </div>
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