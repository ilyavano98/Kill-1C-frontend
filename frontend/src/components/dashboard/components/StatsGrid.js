import React from "react";

export function StatsGrid() {
    return (
        <>
            <div className="grid" id="statsGrid">
                <div className="card stat">
                    <div className="label">Выручка сегодня</div>
                    <div className="value" id="revenue-today">0 ₽</div>
                    <div className="muted">Завершено: <span id="completed-today">0</span></div>
                    <div className="stat-icon">
                        <i className="bi bi-currency-dollar" style={{ color: '#10b981' }}></i>
                    </div>
                </div>
                <div className="card stat">
                    <div className="label">Выручка за неделю</div>
                    <div className="value" id="revenue-week">0 ₽</div>
                    <div className="muted">Активных: <span id="active-week">0</span></div>
                    <div className="stat-icon">
                        <i className="bi bi-graph-up" style={{ color: '#7c3aed' }}></i>
                    </div>
                </div>
                <div className="card stat">
                    <div className="label">Выручка за месяц</div>
                    <div className="value" id="revenue-month">0 ₽</div>
                    <div className="muted">Всего: <span id="total-appointments">0</span></div>
                    <div className="stat-icon">
                        <i className="bi bi-calendar-month" style={{ color: '#f59e0b' }}></i>
                    </div>
                </div>
                <div className="card stat">
                    <div className="label">Клиенты</div>
                    <div className="value" id="total-clients">0</div>
                    <div className="muted">Авто: <span id="total-cars">0</span></div>
                    <div className="stat-icon">
                        <i className="bi bi-people" style={{ color: '#06b6d4' }}></i>
                    </div>
                </div>
            </div>
        </>
    );
}