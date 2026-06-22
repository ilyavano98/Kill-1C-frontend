import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, navItems, onCreateClick, isMobile }) => {
    // Для десктопа: состояние наведения (сворачивание/разворачивание)
    const [isHovered, setIsHovered] = useState(false);

    // Определяем, должен ли сайдбар быть развёрнут:
    // - на мобилках: по isOpen
    // - на десктопе: по isHovered (или всегда развёрнут, если isOpen=true, но на десктопе isOpen обычно false)
    const isExpanded = isMobile ? isOpen : isHovered;

    return (
        <>
            {isMobile && isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
            <aside
                className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${isMobile ? 'mobile' : 'desktop'}`}
                onMouseEnter={() => !isMobile && setIsHovered(true)}
                onMouseLeave={() => !isMobile && setIsHovered(false)}
            >
                <div className="sidebar-header">
                    <div className="logo">🧼</div>
                    <div className="brand-name">MiniCRM</div>
                    {isMobile && (
                        <button className="close-btn" onClick={onClose}>
                            <span>✕</span>
                        </button>
                    )}
                </div>
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={isMobile ? onClose : undefined}
                        >
                            <i className={`bi ${item.icon}`}></i>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <button className="create-btn" onClick={onCreateClick}>
                    <i className="bi bi-plus-lg"></i>
                    <span className="btn-label">Создать</span>
                </button>
            </aside>
        </>
    );
};

export default Sidebar;