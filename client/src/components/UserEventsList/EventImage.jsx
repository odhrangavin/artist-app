import eventImage from '../../assets/icons/event_image.png';

export default function EventImage(props) {
  const { imageUrl, suspended, eventTitle, imgClassName } = props;
  const imgAlt = 'Event Image';

  return (
    <>
      {(
        <div style={{ position: "relative", display: "inline-block" }}>
          {suspended && (
            <div className="suspended-badge">
              Suspended
            </div>
          )}
          <img 
            src={imageUrl || eventImage } 
            alt={imageUrl ? eventTitle : imgAlt}
            className={imgClassName || "event-image"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = eventImage;
              e.target.alt = imgAlt;
            }}
          />
        </div>
      )}
    </>
  )
}
