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
                        <FaChartLine href={'/statistics'} /> Статистика
                    </li>
                    <li>
                        <FaCog href={'/settings'} /> Настройки
                    </li>
                </ul>
            </div>
        </>
    );
}
