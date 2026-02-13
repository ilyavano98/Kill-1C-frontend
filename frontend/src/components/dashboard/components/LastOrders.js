import React from "react";

export function LastOrders() {
    return (
        <>
            <div className="card" style={{ marginTop: '18px' }}>
                <h5 style={{ margin: '0 0 12px 0' }}>Последние записи</h5>
                <table className="table compact-table">
                    <thead>
                    <tr>
                        <th>Время</th>
                        <th>Клиент</th>
                        <th>Авто</th>
                        <th>Услуга</th>
                        <th>Сотрудник</th>
                        <th>Статус</th>
                        <th>Сумма</th>
                    </tr>
                    </thead>
                    <tbody id="recent-appointments"></tbody>
                </table>
            </div>
        </>
    );
}