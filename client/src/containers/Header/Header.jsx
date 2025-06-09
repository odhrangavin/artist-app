import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import UserMenu from "./UserMenu";
import "./Header.css";

export default function Header() {

	const [menuOpen, setMenuOpen] = useState(false);

	const handleBurgerClick = () => setMenuOpen((open) => !open);
	const handleNavLinkClick = () => setMenuOpen(false);


	return (
		<header className="header">
			<Link to="/" className="header-logo" onClick={handleNavLinkClick}>
				<h1>Event App</h1>
			</Link>
			<button
				className={`burger${menuOpen ? " open" : ""}`}
				onClick={handleBurgerClick}
				aria-label="Toggle navigation menu"
			>
				<span />
				<span />
				<span />
			</button>
			<ul className={`nav-menu${menuOpen ? " open" : ""}`}>
				<li>
					<NavLink to="/" onClick={handleNavLinkClick}>Home</NavLink>
				</li>
				<UserMenu onLinkClick={handleNavLinkClick} />
			</ul>
		</header>
	);
}
