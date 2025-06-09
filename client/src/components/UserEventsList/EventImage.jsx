import eventImage from '../../assets/icons/event_image.png';

export default function EventImage(props) {
  const { imageUrl, suspended, evenTitle, imgClassName } = props;
  
  return (
    <>
      {(
        <div style={{ position: "relative", display: "inline-block" }}>
          {suspended && (
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
          <img 
            src={imageUrl || eventImage } 
            alt={imageUrl ? evenTitle : 'Event Image'}
            className={imgClassName}
            style={{ maxWidth: 220, maxHeight: 130, borderRadius: 6 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = eventImage;
            }}
          />
        </div>
      )}
    </>
  )


}
