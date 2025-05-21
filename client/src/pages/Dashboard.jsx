import EventForm from '../components/EventForm';
import EventList from '../components/EventList';
import ExternalEventList from '../components/ExternalEventList';


export default function Dashboard() {
    return (
        <div>
            <h2>Dashboard</h2>
            {/* <EventForm />
            <EventList /> 
            <hr />
            */}
            <ExternalEventList />
        </div>
    );
}
