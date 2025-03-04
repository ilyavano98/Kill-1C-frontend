import {FaChartLine, FaCog, FaHome} from "react-icons/fa";
import React from "react";

export function Sidebar() {
    return (
        <>
            {/* Боковое меню */}
            <div className="sidebar">
                <div className="logo">Наш Логотип</div>
                <ul className="menu">
                    <li>
                        <FaHome /> Главная
                    </li>
                    <li>
                        <FaChartLine /> Статистика
                    </li>
                    <li>
                        <FaCog /> Настройки
                    </li>
                </ul>
            </div>
        </>
    );
}
