import React from "react";
import {SimpleTablePage} from "../SimpleTablePage";
import {SimpleModal} from "../SimpleModal";

export function Shifts() {
    return (
        <>
            <SimpleTablePage
                id="shifts"
                title="Рабочие смены"
                subtitle="учет рабочего времени"
                addButtonText="+ Новая смена"
                columns={[
                    { key: 'name', label: 'Дата' },
                    { key: 'type', label: 'Сотрудник' },
                    { key: 'beginDate', label: 'Начало' },
                    { key: 'endDate', label: 'Конец' },
                    { key: 'autoSuccess', label: 'Авто обработано' },
                    { key: 'actions', label: 'Действия' }
                ]}
                modalId = "shiftModal"
                tableId = "shiftsTbody"
            />
            <SimpleModal
                modalId="shiftModal"
                modalTitle="Новая смена"
                fields={[
                    {
                        id: "shiftDate",
                        type: "date",
                        placeholder: "Дата",
                        className: "form-control mb-2",
                        required: true,
                    },
                    {
                        id: "shiftEmployeeId",
                        type: "select",
                        className: "form-control mb-2"
                    },
                    {
                        id: "shiftStart",
                        type: "time",
                        required: true,
                    },
                    {
                        id: "shiftEnd",
                        type: "time",
                        required: true,
                    },
                    {
                        id: "shiftCarsCount",
                        type: "number",
                        min: 0,
                        placeholder: "Авто обработано",
                        className: "form-control"
                    }
                ]}
                hiddenFields={[
                    {id: "shiftId", type: "hidden"}
                ]}
                saveButtonId = "saveShiftBtn"
            />
        </>
    );
}
