import React, {useState} from "react";
import CalendarLib from "react-calendar";

export function Calendar() {
    const [date, setDate] = useState(new Date());
    const onChange = (newDate) => setDate(newDate);
    return (
        <>
            {/* Календарь */}
            <div className="calendar-container">
                <h2>Календарь</h2>
                <CalendarLib onChange={onChange} value={date} />
            </div>
        </>
    );
}