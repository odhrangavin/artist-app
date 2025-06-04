import { useState, useEffect } from "react";

import { useAuth } from '../../context/AuthContext';
import { HeartButton } from '../../pages/Dashboard/Heart';

// Component to show the current user's events using /users/me/events/
function EventCards(props) {
    const { events, faves, title, noEvent } = props;
    const { isLoggedIn } = useAuth();

    if (!events.length) return <div>{ noEvent || 'No events posted yet.'}</div>;

    return (
      <section className="user-events-list">
        <h3>{title}</h3>
        <ul className="event-grid">
          {events.map(ev => (
            <li key={ev.id} className="event-card">
              {ev.image_url && (
                <img src={ev.image_url} alt={ev.title} 
                  style={{ maxWidth: 220, maxHeight: 130 }} 
                />
              )}
              <h4>{ev.title}</h4>
              <p>{ev.description}</p>
              <p><strong>Date:</strong> {ev.event_date}</p>
              <p><strong>Time:</strong> {ev.event_time}</p>
              <p><strong>Location:</strong> {ev.location}</p>
              <p><strong>Venue:</strong> {ev.venue}</p>
              <p><strong>Genre:</strong> {ev.genre}</p>
              <div className="event-card-actions" style={{ marginTop: "0.7em", display: "flex", gap: "0.7em" }}>
                <button
                  type="button"
                  className="event-action-btn event-view-btn"
                  onClick={() => handleView(ev.id)}
                >
                  View Event
                </button>
                <button
                  type="button"
                  className="event-action-btn event-edit-btn"
                  onClick={() => handleEdit(ev.id)}
                >
                  Edit Event
                </button>
                <HeartButton 
                  eventId={ev.id} 
                  faveObject={faves.find(fave => fave.event === ev.id)} 
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
}

export default EventCards;