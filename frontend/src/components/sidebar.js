import {FaChartLine, FaCog, FaHome} from "react-icons/fa";
import React from "react";
import {Link} from "react-router-dom";

export function Sidebar() {
    return (
        <>
            {/* Боковое меню */}
            <div className="sidebar">
                <div className="logo">Наш Логотип</div>
                <ul className="menu">
                    <li>
                        <Link to="/" className="btn btn-primary">Главная</Link>
                    </li>
                    <li>
                        <Link to="/statistics" className="btn btn-primary">Статистика</Link>
                    </li>
                    <li>
                        <Link to="/settings" className="btn btn-primary">Настройки</Link>
                    </li>
                    <li>
                        <Link to="/day" className="btn btn-primary">Календарь</Link>
                    </li>
                </ul>
            </div>
        </>
    );
}
