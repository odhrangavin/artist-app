import { Link } from "react-router-dom";
import LoginMenu from "../../components/Auth/LoginMenu";

export default function Header() {
	return (
		<header>
			<h1>Event App</h1>
			<ul>
				<li><Link to="/">Home</Link></li>
				<li><Link to="/dashboard">Dashboard</Link></li>
				<LoginMenu />
			</ul>
		</header>
	);
}
