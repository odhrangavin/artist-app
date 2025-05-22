import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
    return (
        <header>
            <h1>Event App</h1>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
        </header>
    );
}
