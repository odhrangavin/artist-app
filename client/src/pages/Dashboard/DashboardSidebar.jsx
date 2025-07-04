export default function DashboardSidebar({ currentSection, onSectionChange }) {
	return (
		<aside className="dashboard-sidebar">
			<nav>
				<ul className="sidebar-list">
					<li>
						<button
							className={currentSection === "create" ? "active" : ""}
							onClick={() => onSectionChange("create")}
						>
							Create Event
						</button>
					</li>
					<li>
						<button
							className={currentSection === "my-events" ? "active" : ""}
							onClick={() => onSectionChange("my-events")}
						>
							All My Events
						</button>
					</li>
					<li>
						<button
							className={currentSection === "favorites" ? "active" : ""}
							onClick={() => onSectionChange("favorites")}
						>
							Favourites
						</button>
					</li>
				</ul>
			</nav>
		</aside>
	);
}
