import { useState, useEffect } from 'react';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export function RemoveFave(props) {
  
  const { user } = useAuth();
  const { faveId, onFaveRemoved } = props;

  const handleClick = async () => {
    
    // Remove fave from DB
    try {
      await API.delete(`users/me/faves/${faveId}`);
      if (onFaveRemoved) {
        onFaveRemoved();
      }

    } catch(error) {
      console.log(error);
    }
  }
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className="favourite-button"
      onClick={handleClick}
    >
      <path 
        strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" 
      />
    </svg>

  )
}
