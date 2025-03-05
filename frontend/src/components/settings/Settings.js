import React from "react";
import {Sidebar} from "../sidebar";
export function Settings() {
    return (
        <>
            <div className="app-container">
                <Sidebar/>
                <div className="container">
                    Ну привет, я твои настройки
                </div>
            </div>
        </>
    );
}