import { useState } from 'react';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import "./Dashboard.scss";

const genres = [
    "Alternative", "Blues", "Children's Theatre", "Circus & Specialty Acts", "Classical", "Comedy",
    "Community/Civic", "Country", "Dance", "Dance/Electronic", "Equestrian", "Fairs & Festivals", "Family",
    "Fitness", "Folk", "Football", "Hip-Hop/Rap", "Jazz", "Latin", "Lecture/Seminar", "Metal", "Miscellaneous",
    "Miscellaneous Theatre", "Music", "Pop", "R&B", "Reggae", "Rock", "Rugby", "Soccer", "Theatre",
    "Variety", "World", "Wrestling", "Other"
];

// Helper for min datetime-local value
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


function EventPreview({ event, imagePreview, onClearImage, onImageDrop }) {
    // if (!event.title && !event.description) return null;  //appear only when type title
    return (
        <div
            className="event-card-preview"
            onDragOver={e => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onDrop={e => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    onImageDrop(e.dataTransfer.files[0]);
                }
            }}
            style={{ border: "2px dashed #ddd", borderRadius: 8, overflow: "hidden", background: "#fafbfc" }}
        >
            {(imagePreview || event.image_url) ? (
                <img
                    src={imagePreview || event.image_url}
                    alt={event.title || "Event"}
                    className="event-image-preview"
                    style={{ width: "100%", height: 180, objectFit: "cover" }}
                />
            ) : (
                <div className="event-image-placeholder" style={{
                    width: "100%",
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    background: "#f6f6f6",
                    fontSize: "1.1em"
                }}>
                    Drag & drop image here<br />(or use upload below)
                </div>
            )}
            <div className="event-preview-content">
                <h4>{event.title || "Event Title"}</h4>
                <p className="event-preview-date">
                    {event.event_time
                        ? new Date(event.event_time).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
                        : "Date & Time"}
                </p>
                <p className="event-preview-location">
                    <b>{event.location || "City"}</b>
                    {event.venue ? <span> &middot; {event.venue}</span> : null}
                </p>
                <p className="event-preview-genre">{event.genre || "Genre"}</p>
                <div className="event-preview-description">
                    {event.description || "Event description will appear here."}
                </div>
            </div>
        </div>
    );
}

export default function DashboardCreateEvent() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        title: '',
        description: '',
        image_url: '',
        event_time: '',
        location: '',
        venue: '',
        genre: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setForm(prev => ({ ...prev, image_url: "" }));
        }
    };

    // Handler drag-and-drop
    const handleImageDrop = file => {
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setForm(prev => ({ ...prev, image_url: "" }));
            document.getElementById("event-image-upload").value = "";
        }
    };



    const handleClearImage = () => {
        setImageFile(null);
        setImagePreview('');
        document.getElementById("event-image-upload").value = "";
    };

    const handleImageUrlChange = e => {
        handleChange(e);
        setImageFile(null);
        setImagePreview('');
        document.getElementById("event-image-upload").value = "";
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        if (form.event_time && new Date(form.event_time) < new Date()) {
            setError("Event date/time cannot be in the past.");
            setSubmitting(false);
            return;
        }

        let imageUrlToSave = form.image_url;

        if (imageFile) {
            try {
                const uploadData = new FormData();
                uploadData.append('file', imageFile);
                const res = await API.post('/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrlToSave = res.data.url;
            } catch (err) {
                setError('Image upload failed.');
                setSubmitting(false);
                return;
            }
        }

        try {
            await API.post('/events', {
                ...form,
                image_url: imageUrlToSave,
                user_id: user?.id,
            });
            setSuccess('Event created!');
            setForm({ title: '', description: '', image_url: '', event_time: '', location: '', venue: '', genre: '' });
            setImageFile(null);
            setImagePreview('');
            document.getElementById("event-image-upload").value = "";
        } catch (err) {
            setError('Failed to create event.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="dashboard-create-event">
            <div className="dashboard-container">
                <form className="event-form" onSubmit={handleSubmit} autoComplete="off">
                    <h3>Create Your Event</h3>
                    <label>Title
                        <input name="title" value={form.title} onChange={handleChange} required maxLength={60} />
                    </label>
                    <label>Image URL
                        <input
                            name="image_url"
                            value={form.image_url}
                            onChange={handleImageUrlChange}
                            placeholder="https://your-image-url"
                            autoComplete="on"
                        />
                    </label>
                    <label>
                        Or upload image:
                        <input
                            id="event-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {/* Show attached file name and remove button if imageFile exists */}
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
                        <input name="location" value={form.location} onChange={handleChange} autoComplete="on" required />
                    </label>
                    <label>Venue
                        <input name="venue" value={form.venue} onChange={handleChange} autoComplete="on" required />
                    </label>
                    <label>Genre
                        <select name="genre" value={form.genre} onChange={handleChange} required>
                            <option value="">Select</option>
                            {genres.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </label>
                    <label htmlFor='description'>Description</label>
                    <textarea id="description" name="description" value={form.description} onChange={handleChange} required rows="4" maxLength={400} />
                    <button type="submit" disabled={submitting} className="event-submit-btn">Create Event</button>
                    {error && <div className="error">{error}</div>}
                    {/* {success && <div className="success">{success}</div>} */}
                </form>
                <div className="event-preview-container">
                    <EventPreview event={form} imagePreview={imagePreview} onClearImage={handleClearImage} onImageDrop={handleImageDrop} />
                    {success && (
                        <div style={{ marginTop: "1em", color: "#2474e5", fontWeight: 600, fontSize: "1.1em" }}>
                            Event Created!
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}