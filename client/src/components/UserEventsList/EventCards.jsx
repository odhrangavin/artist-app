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
    <div className="user-events-list">
      <h3>{title}</h3>
      <ul className="event-grid">
        {events.map(ev => (
          <li key={ev.id} className="event-card">
            <div className="event-body">
              {ev.image_url && (
                <div style={{ position: "relative", display: "inline-block" }}>
                  {!!ev.suspended && (
                    <div className="suspended-badge">
                      Suspended
                    </div>
                  )}
                  <img src={ev.image_url} alt={ev.title}
                    className="event-image"
                  />
                </div>
              )}
              <h4>{ev.title}</h4>
              <p>
                <strong>Date/Time:</strong> {ev.event_date} {ev.event_time}
              </p>
              <p><strong>City:</strong> {ev.location}</p>
              <p><strong>Venue:</strong> {ev.venue}</p>
              <p><strong>Genre:</strong> {ev.genre}</p>
              <p className="event-description">
                {(ev.description || "No description available").length > 90
                  ? (
                    <>
                      {(ev.description || "No description available").slice(0, 90)}...
                    </>
                  )
                  : (ev.description || "No description available")
                }
              </p>
            </div>
            <div className="event-card-actions">
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
    </div>
  );
}

export default EventCards;