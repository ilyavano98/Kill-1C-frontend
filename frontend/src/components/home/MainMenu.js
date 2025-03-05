import React from "react";
import {ToDayClients} from "./ToDayClients";
import {Calendar} from "./calendar/Calendar";
import {Statistic} from "./Statistic";
import {GeneralPlan} from "./GeneralPlan";

export function MainMenu() {
    return (
        <>
        <div className="main-content">
            <h1>Здарова!</h1>
            {/* Первая строка: Статистика и Общий план месяца */}
            <div className="row-container">
                <Statistic/>
                <GeneralPlan/>
            </div>
            {/* Вторая строка: Клиенты и календарь */}
            <div className="clients-calendar-container">
                <ToDayClients/>
                <Calendar/>
            </div>
        </div>
        </>
    );
}