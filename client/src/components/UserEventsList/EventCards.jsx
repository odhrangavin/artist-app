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
        <ul>
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
              <p>{isLoggedIn ? 
                <HeartButton eventId={ev.id} 
                  faveObject={faves.find(fave => fave.event === ev.id)} 
                /> : ''}
              </p>
            </li>
          ))}
        </ul>
      </section>
    );
}

export default EventCards;