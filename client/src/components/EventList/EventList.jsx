// import { useEffect, useState } from 'react';

// export default function EventList() {
//     const [events, setEvents] = useState([]);

//     const loadEvents = () => {
//         const data = JSON.parse(localStorage.getItem('events')) || [];
//         setEvents(data);
//     };

//     useEffect(() => {
//         loadEvents();
//         window.addEventListener('event-added', loadEvents);
//         return () => window.removeEventListener('event-added', loadEvents);
//     }, []);

//     return (
//         <ul>
//             {events.map((e) => (
//                 <li key={e.id}>
//                     <strong>{e.title}</strong>: {e.description}
//                 </li>
//             ))}
//         </ul>
//     );
// }
