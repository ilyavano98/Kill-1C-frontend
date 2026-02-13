import React from "react";
import {Link} from "react-router-dom";

export function Sidebar() {
    return (
        <>
            <aside className="sidebar">
                <div className="brand">
                    <div className="logo">🦈</div>
                    <div className="title">SharkTail</div>
                </div>
                <nav className="leftnav" id="nav">
                    <li> <Link to="/" className="nav-link active"><i
                        className="bi bi-speedometer2"></i><span>Дашборд</span></Link></li>
                    <li> <Link to="/clients" className="nav-link" data-section="clients"><i
                        className="bi bi-people"></i><span>Клиенты</span></Link></li>
                    <li> <Link to="/cars" className="nav-link" data-section="cars"><i
                        className="bi bi-car-front"></i><span>Автомобили</span></Link></li>
                    <li> <Link to="/services" className="nav-link" data-section="services"><i
                        className="bi bi-tools"></i><span>Услуги</span></Link></li>
                    <li> <Link to="/employees" className="nav-link" data-section="employees"><i
                        className="bi bi-person-badge"></i><span>Сотрудники</span></Link></li>
                    <li> <Link to="/appointments" className="nav-link" data-section="appointments"><i
                        className="bi bi-calendar-check"></i><span>Записи</span></Link></li>
                    <li> <Link to="/shifts" className="nav-link" data-section="shifts"><i
                        className="bi bi-clock"></i><span>Смены</span></Link></li>
                    <li> <Link to="/carwashes" className="nav-link" data-section="carwashes"><i
                        className="bi bi-building"></i><span>Мойки</span></Link></li>
                    <li> <Link to="/washbays" className="nav-link" data-section="washbays"><i className="bi bi-geo-alt"></i><span>Моечные места</span></Link></li>
                    <li> <Link to="/load-dashboard" className="nav-link" data-section="load-dashboard"><i
                        className="bi bi-calendar-week"></i><span>Загрузка моек</span></Link></li>
                </nav>
                <button className="create-btn" id="openCreate">
                    <i className="bi bi-plus-lg"></i>
                    <span>Создать</span>
                </button>
            </aside>
        </>
    );
}
