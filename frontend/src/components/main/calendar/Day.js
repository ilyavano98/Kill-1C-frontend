import React, { useState, useEffect } from 'react';
import axios from "axios";
import {Sidebar} from "../../sidebar";

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
    useEffect(() => {
        axios.get("http://localhost:8080/api/washPage")
            .then((response) => {
                if (response.status === 200) {
                    setWashItems(response.data);
                } else if (response.status === 401) {
                    console.error('Unauthorized. Check your authentication credentials.');
                } else if (response.status === 404) {
                    console.error('Resource not found.');
                } else {
                    console.error('An unexpected error occurred.');
                }
            })
            .catch((error) => {
                console.error('Error:', error.message);
            });
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