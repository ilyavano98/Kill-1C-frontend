import {Sidebar} from "../sidebar";
import {MainMenu} from "../home/MainMenu";
import React from "react";

export function Home() {
    return (
        <div className="app-container">
            <Sidebar/>
            <MainMenu/>
        </div>
    );
}
