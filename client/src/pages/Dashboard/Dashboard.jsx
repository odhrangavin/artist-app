import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardCreateEvent from "./DashboardCreateEvent";
import DashboardMyEvents from "./DashboardMyEvents";
import DashboardFavorites from "./DashboardFavorites";

export default function Dashboard() {
    const [currentSection, setCurrentSection] = useState("create");

    return (
        <div className="dashboard-container" style={{ display: "flex" }}>
            <h2>Welcome to your Dashboard</h2>
            <main style={{ flex: 1, marginLeft: 24 }}>
                {currentSection === "create" && <DashboardCreateEvent />}
                {currentSection === "my-events" && <DashboardMyEvents />}
                {currentSection === "favorites" && <DashboardFavorites />}
            </main>
            <DashboardSidebar
                currentSection={currentSection}
                onSectionChange={setCurrentSection}
            />
        </div>
    );
}