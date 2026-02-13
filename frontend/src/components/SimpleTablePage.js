import React, { useState } from 'react';
import AppointmentTable from "./appointments/AppointmentTable";

export function SimpleTablePage({

     id= "clients",
     title = "Клиенты",
     subtitle = "список всех клиентов",
     addButtonText = "+ Новый клиент",
     columns = [
         { key: 'name', label: 'ФИО / Компания' },
         { key: 'phone', label: 'Телефон' },
         { key: 'email', label: 'Email' },
         { key: 'auto', label: 'Авто' },
         { key: 'actions', label: 'Действия' }
     ],
     modalId = "clientModal",
     tableId = "clientsTbody",
     isAppointments = false
 }) {
    // Предполагаем, что storage - это состояние вашего приложения
    const [storage, setStorage] = useState({
        appointments: [],
        clients: [],
        cars: [],
        services: [],
        employees: [],
        washBays: []
    });

    // Обработчики действий
    const handleEditAppointment = (id) => {
        console.log('Редактирование записи:', id);
        // Открытие модалки редактирования
    };

    const handleDeleteAppointment = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
            console.log('Удаление записи:', id);
            // Удаление из storage
        }
    };

    const handleStatusChange = (id) => {
        console.log('Изменение статуса записи:', id);
        // Открытие меню выбора статуса
    };

    // Загрузка данных (пример)
    // useEffect(() => {
    //     // Загрузите данные с API или localStorage
    //     const loadData = async () => {
    //         // ... загрузка данных
    //     };
    //     loadData();
    // }, []);
    return (
        <>
            <div id={id} className="view fadeup">
                <div className="card" style={{ marginBottom: '12px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h5 style={{ margin: 0 }}>{title}</h5>
                            <div className="muted">{subtitle}</div>
                        </div>
                        <div>
                            <button
                                className="btn btn-sm btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target={`#${modalId}`}
                            >
                                {addButtonText}
                            </button>
                        </div>
                    </div>
                </div>
                {isAppointments ? <AppointmentTable
                    storage={storage}
                    onEditAppt={handleEditAppointment}
                    onDeleteAppt={handleDeleteAppointment}
                    onStatusChange={handleStatusChange}/> : ''}
                <div className="card">
                    <table className="table compact-table">
                        <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index}>{column.label}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody id={tableId}></tbody>
                    </table>
                </div>
            </div>
        </>
    );
}