import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardCreateEvent from "./DashboardCreateEvent";
import DashboardMyEvents from "./DashboardMyEvents";
import DashboardFavorites from "./DashboardFavorites";
import DashboardEditEvent from "./DashboardEditEvent";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
	const [currentSection, setCurrentSection] = useState("create");
	const { user, isLoggedIn } = useAuth();

	function renderMain() {
			if (typeof currentSection === "string") {
				if (currentSection === "create") return <DashboardCreateEvent />;
				if (currentSection === "my-events") {
					return <DashboardMyEvents onEditEvent={id => setCurrentSection({ type: "edit", eventId: id })} />;
				}
				if (currentSection === "favorites") return <DashboardFavorites />;
			}
			if (currentSection && currentSection.type === "edit") {
				return (
					<DashboardEditEvent
						eventId={currentSection.eventId}
						onBack={() => setCurrentSection("my-events")}
					/>
				);
			}
			return null;
	}

	function MainSection() {
		if (!isLoggedIn) return // To avoid error. Not logged users should be redirected by Protected component
			 
		if (user.role == "organizer") {
			return (
				<>
					<main style={{ flex: 1, marginLeft: 24 }}>
						{renderMain()}
					</main>
					<DashboardSidebar
						currentSection={typeof currentSection === "string" ? currentSection : "my-events"}
						onSectionChange={setCurrentSection}
					/>
				</>
			);
		} else if (user.role == "attendee") {
			return (
			<main style={{ flex: 1, marginLeft: 24 }}>
				<DashboardFavorites />
			</main>
		);} else {
			return <p>Are you an organizer or an attendee?</p>;
		}
	}

	return (
		<div className="dashboard">
			<h2 style={{ display: "none" }}>Welcome to your Dashboard</h2>
			<MainSection />
		</div>
	);
}