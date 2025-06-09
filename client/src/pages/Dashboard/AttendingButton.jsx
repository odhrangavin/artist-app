import { useState, useEffect } from 'react';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export function AttendingButton(props) {
  
  const { user } = useAuth();
  const { eventId, attendObject } = props;
  const [attending, setAttending] = useState(!!attendObject);
  const [updatedObject, setUpdatedObject] = useState(attendObject);
  const [buttonText, setButtonText] = useState('');

  // Force showing attending status in case attendObject is loaded late
  useEffect(() => {
    setAttending(!!attendObject);
    setUpdatedObject(attendObject);
    setButtonText(!attendObject ? `I'll Attend` : `Cancel Attendance`);
    
    //console.log(eventId)
  }, [attendObject]);

  const handleClick = async () => {
    
    // Toggle button
    const newAttending = !attending;
    setAttending(newAttending);

    // Update in DB
    if (newAttending) {
      try {
        const res = await API.post('/users/me/attending', {
          user_id: user.id,
          event: eventId
        });
        // Manually update the object
        setUpdatedObject(
          prevAttending => ({ ...prevAttending, id:res.data.lastID})
        )
        setButtonText(`Cancel Attendance`);
      } catch(error) {
        console.log(error);
      }
    } else {
      try {
        await API.delete(`/users/me/attending/${updatedObject.id}`);
        setButtonText(`I'll Attend`);
      } catch(error) {
        console.log(error);
      }
    }
   
  }
  
  return (
    <button onClick={handleClick}>{buttonText}</button>
  )
}
