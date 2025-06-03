import { NavLink } from "react-router-dom";
import UserMenu from "./UserMenu";
import "./Header.css";

export default function Header() {
	return (
		<header>
			<h1>Event App</h1>
			<ul>
				<li><NavLink to="/">Home</NavLink></li>
				<UserMenu />
			</ul>
		</header>
	);
}
