import { useState } from 'react';

export default function EventForm() {
    const [form, setForm] = useState({ title: '', description: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        const event = { ...form, id: Date.now() };
        const existing = JSON.parse(localStorage.getItem('events')) || [];
        localStorage.setItem('events', JSON.stringify([event, ...existing]));
        setForm({ title: '', description: '' });
        window.dispatchEvent(new Event('event-added'));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <button type="submit">Add Event</button>
        </form>
    );
}
