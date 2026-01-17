import React, { useState, useEffect } from 'react';
import {Sidebar} from "../../sidebar";
import orderService from "../../../app/services/order.service";

// const USERNAME = 'admin@mail.ru';
// const PASSWORD = '123';
export function Day() {
    // const headers = {
    //     'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`
    // };
    const [washItems, setWashItems] = useState([
        {
            box: '',
            boxId: '',
            boxName: '',
            date: new Date(),
            endTime: new Date(),
            id: '',
            serviceName: '',
            serviceType: '',
            serviceTypeId: '',
            startTime: new Date(),
            status: '',
            time: '',
            user: '',
            userId: '',
        }
    ]);
    const [daysWeek, setDaysWeek] = useState([
        "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        async function fetchData() {
            await orderService.getWashPageContent();
        }
        fetchData();
        }, []);
    washItems.map(washItem => {
        return {
            ...washItem,
            startTime: new Date(washItem.startTime),
            endTime: new Date(washItem.endTime),
        }
    });
    return (
        <div className="app-container">
            <Sidebar/>
            <div className="container">
                {daysWeek.map((day,dayIndex) => (
                    <div key={dayIndex} className="clients-container">
                        <h2>{day}</h2>
                        {washItems.map((washItem, washIndex) => (
                            <div key={washIndex} className="client-item">
                                {/* Аватар клиента */}
                                <div className="client-avatar">{washItem.boxName.charAt(0)}</div>
                                {/* Информация о клиенте */}
                                <div className="client-info">
                                    <span className="client-name">{washItem.boxName}</span>
                                    <span className="client-service">{washItem.boxName}</span>
                                </div>
                                {/* Статус клиента */}
                                <span
                                    className="client-status"
                                    style={{ backgroundColor: '#FFD700' }}
                                >
                                  {washItem.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};