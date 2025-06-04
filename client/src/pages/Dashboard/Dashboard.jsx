import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardCreateEvent from "./DashboardCreateEvent";
import DashboardMyEvents from "./DashboardMyEvents";
import DashboardFavorites from "./DashboardFavorites";
import DashboardEditEvent from "./DashboardEditEvent";

export default function Dashboard() {
    const [currentSection, setCurrentSection] = useState("create");

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

    return (
        <div className="dashboard">
            <h2 style={{ display: "none" }}>Welcome to your Dashboard</h2>
            <main style={{ flex: 1, marginLeft: 24 }}>
                {renderMain()}
            </main>
            <DashboardSidebar
                currentSection={typeof currentSection === "string" ? currentSection : "my-events"}
                onSectionChange={setCurrentSection}
            />
        </div>
    );
}