import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import React from "react";

export function Statistic() {
    return (
        <>
            {/* Блок статистики */}
            <div className="statistics-container">
                <h2>Статистика</h2>
                <p>Общие показатели загрузки и выполнения плана.</p>
                <div className="stats-row">
                    {[
                        { label: 'Мойка', percent: 25, color: '#FFD700', text: 'Плохо' },
                        { label: 'Техосмотр', percent: 50, color: '#6A5ACD', text: 'Средне' },
                        { label: 'Загрузка', percent: 62, color: '#2ECC71', text: 'Хорошо' },
                        { label: 'План', percent: 75, color: '#2ECC71', text: 'Хорошо' },
                    ].map((item, index) => (
                        <div key={index} className="stat-item">
                            <CircularProgressbar
                                value={item.percent}
                                text={`${item.percent}%`}
                                styles={buildStyles({
                                    pathColor: item.color,
                                    textColor: '#333',
                                    trailColor: '#E0E0E0',
                                })}
                            />
                            <div className="stat-label">{item.label}</div>
                            <span
                                className="status-badge"
                                style={{ backgroundColor: item.color, color: 'white' }}
                            >
                                {item.text}
                              </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}