import EventForm from '../components/EventForm';
import EventList from '../components/EventList';
import ExternalEventList from '../components/ExternalEventList';
import './Dashboard.css';


export default function Dashboard() {
    return (
        <div className='dashboard'>
            <h2>Dashboard</h2>
            {/* <EventForm />
            <EventList /> 
            <hr />
            */}
            <ExternalEventList />
        </div>
    );
}
