import React from "react";
import {StatsGrid} from "./components/StatsGrid";
import {ActiveClients} from "./components/ActiveClients";
import {LastOrders} from "./components/LastOrders";

export function Dashboard() {
    return (
        <>
            <div id="dashboard" className="view fadeup">
                <StatsGrid />
                <ActiveClients />
                <LastOrders />
            </div>
        </>
    );
}
