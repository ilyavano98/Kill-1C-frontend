import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";

const data = [
    { name: 'Дек', план: 70 },
    { name: 'Янв', план: 85 },
    { name: 'Фев', план: 78 },
    { name: 'Мар', план: 90 },
];
export function GeneralPlan() {
    return (
        <>
            {/* Общий план месяца */}
            <div className="month-plan-container">
                <h2>Общий план месяца</h2>
                <p>Сравнение показателей по месяцам:</p>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="план"
                                stroke="#6A5ACD"
                                strokeWidth={2}
                                dot={{ r: 5, fill: '#6A5ACD' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}