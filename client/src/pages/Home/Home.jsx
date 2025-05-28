import ExternalEventList from '../../components/ExternalEventList/ExternalEventList';
import UserEventsList from '../../components/userEventsList/userEventsList.jsx';
import './Home.css';

export default function Home() {
    return (
        <div>
            <h2>Welcome to Event App</h2>
            <p>Search and save your favorite events. Login or Register to get started.</p>

            <ExternalEventList />
            <UserEventsList />
        </div>
    );
}

