import React from "react";

export function ToDayClients() {
    return (
        <>
            {/* Клиенты за сегодня */}
            <div className="clients-container">
                <h2>Клиенты за сегодня</h2>
                {[
                    { name: 'Иван Иванов', service: 'Мойка', status: 'Был', statusColor: '#C8E6C9' },
                    { name: 'Петр Петров', service: 'Техосмотр', status: 'Бронь', statusColor: '#FFD700' },
                    { name: 'Сидор Сидоров', service: 'Шиномонтаж', status: 'Был', statusColor: '#C8E6C9' },
                    { name: 'Олег Олегов', service: 'Мойка', status: 'Был', statusColor: '#C8E6C9' },
                ].map((client, index) => (
                    <div key={index} className="client-item">
                        {/* Аватар клиента */}
                        <div className="client-avatar">{client.name.charAt(0)}</div>
                        {/* Информация о клиенте */}
                        <div className="client-info">
                            <span className="client-name">{client.name}</span>
                            <span className="client-service">{client.service}</span>
                        </div>
                        {/* Статус клиента */}
                        <span
                            className="client-status"
                            style={{ backgroundColor: client.statusColor }}
                        >
                                  {client.status}
                                </span>
                    </div>
                ))}
            </div>
        </>
    );
}