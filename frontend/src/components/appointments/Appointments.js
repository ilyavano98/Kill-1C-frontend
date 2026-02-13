import React from "react";
import {SimpleTablePage} from "../SimpleTablePage";
import {SimpleModal} from "../SimpleModal";

export function Appointments() {
    return (
        <>
            <SimpleTablePage
                id="services"
                title="Услуги"
                subtitle="прайс-лист услуг"
                addButtonText="+ Новая услуга"
                columns={[
                    { key: 'name', label: 'Название' },
                    { key: 'type', label: 'Тип' },
                    { key: 'cost', label: 'Цена (₽)' },
                    { key: 'actions', label: 'Действия' }
                ]}
                modalId = "serviceModal"
                tableId = "servicesTbody"
                isAppointments={true}
            />
            <SimpleModal
                modalId="carModal"
                modalTitle="Новое авто"
                fields={[
                    {
                        id: "carPlate",
                        placeholder: "Госномер",
                        required: true,
                    },
                    {
                        id: "carBrand",
                        placeholder: "Марка",
                        required: true,
                    },
                    {
                        id: "carModel",
                        placeholder: "Модель",
                        required: true,
                    },
                    {
                        id: "carYear",
                        type: "number",
                        placeholder: "Год",
                        required: true,
                    },
                    {
                        id: "carBodyType",
                        type: "select",
                        className: "form-select",
                        placeholder: "Выберите тип автомобиля",
                        options: ["Седан", "Внедорожник", "Хэтчбек", "Универсал", "Минивэн"]
                    },
                ]}
                saveButtonId = "saveShiftBtn"
            />
        </>
    );
}
