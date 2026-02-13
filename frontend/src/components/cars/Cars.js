import React from "react";
import {SimpleTablePage} from "../SimpleTablePage";
import {SimpleModal} from "../SimpleModal";

export function Cars() {
    return (
        <>
            <SimpleTablePage
                id="cars"
                title="Автомобили"
                subtitle="учет автомобилей клиентов"
                addButtonText="+ Новое авто"
                columns={[
                    { key: 'number', label: 'Госномер' },
                    { key: 'markaModel', label: 'Марка/Модель' },
                    { key: 'birthYear', label: 'Год' },
                    { key: 'client', label: 'Клиент' },
                    { key: 'typeBody', label: 'Тип кузова' },
                    { key: 'actions', label: 'Действия' }
                ]}
                modalId = "carModal"
                tableId = "carsTbody"
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
