import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation

import { useAuth } from '../../context/AuthContext';
import { HeartButton } from '../../pages/Dashboard/HeartButton';
import { AttendingButton } from "../../pages/Dashboard/AttendingButton";


// Component to show the current user's events using /users/me/events/
function EventCards(props) {
  const { events, faves, attends, title, noEvent, onFaveRemoved, onEditEvent } = props;
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/events/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/events/edit/${id}`);
  };

  if (!events.length) return <div>{noEvent || 'No events posted yet.'}</div>;
  
  return (
    <section className="user-events-list">
      <h3>{title}</h3>
      <ul className="event-grid">
        {events.map(ev => (
          <li key={ev.id} className="event-card">
            {ev.image_url && (
              <div style={{ position: "relative", display: "inline-block" }}>
                {!!ev.suspended && (
                  <div style={{
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#c00",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1.3em",
                    padding: "0.3em 1.2em",
                    borderRadius: 8,
                    zIndex: 2,
                    opacity: 0.92,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                  }}>
                    Suspended
                  </div>
                )}
                <img src={ev.image_url} alt={ev.title} 
                  style={{ maxWidth: 220, maxHeight: 130, borderRadius: 6 }} 
                />
              </div>
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
              {ev.event_user_id === user.id ?      
                <button
                  type="button"
                  className="event-action-btn event-edit-btn"
                  onClick={() => onEditEvent(ev.id)}
                >
                  Edit Event
                </button> : <AttendingButton 
                  eventId={ev.id}
                  attendObject={attends.find(attend => attend.event === ev.id)}  
                />
              } 
            
              <HeartButton 
                eventId={ev.id} 
                faveObject={faves.find(fave => fave.event === ev.id)} 
                onFaveRemoved={onFaveRemoved} 
              />
            </div>     
          </li>
        ))}
      </ul>
    </section>
  );
}

export default EventCards;