import { useState, useEffect } from 'react';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export function HeartButton(props) {
  
  const { user } = useAuth();
  const { eventId, faveObject, onFaveRemoved } = props;
  const [liked, setLiked] = useState(!!faveObject);
  const [updatedObject, setUpdatedObject] = useState(faveObject)

  // Force showing liked events in case faveObject is loaded late
  useEffect(() => {
    setLiked(!!faveObject);
    setUpdatedObject(faveObject);
  }, [faveObject])
 

  const handleClick = async () => {
    
    // Toggle button
    const newLiked = !liked;
    setLiked(newLiked);

    // Update in DB
    if (newLiked) {
      try {
        const res = await API.post('users/me/faves', {
          user_id: user.id,
          event: eventId
        });
        // Manually update the object
        setUpdatedObject(
          prevFave => ({ ...prevFave, id:res.data.lastID})
        )
      } catch(error) {
        console.log(error);
      }
    } else {
      try {
        await API.delete(`users/me/faves/${updatedObject.id}`);
        if (onFaveRemoved) {
          onFaveRemoved();
        }
      } catch(error) {
        console.log(error);
      }
    }
   
  }
  
  return (
    <svg xmlns="http://www.w3.org/2000/svg" 
      fill={liked ? "red" : "none"} 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke={liked ? "red" : "currentColor"} 
      className="favourite-button"
      onClick={handleClick}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  )
}
