import React from "react";
import {SimpleTablePage} from "../SimpleTablePage";
import {SimpleModal} from "../SimpleModal";

export function Services() {
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
            />
            <SimpleModal
                modalId="serviceModal"
                modalTitle="Новая услуга"
                fields={[
                    {
                        id: "serviceName",
                        placeholder: "Название",
                        required: true,
                    },
                    {
                        id: "serviceType",
                        type: "select",
                        placeholder: "Выберите тип автомобиля",
                        options: ["Мойка", "Доп. услуга", "Хэтчбек", "Универсал", "Минивэн"]
                    },
                    {
                        id: "servicePrice",
                        type: "number",
                        className: "form-control",
                        placeholder: "Цена (₽)",
                        required: true,
                    },
                ]}
                hiddenFields={[
                    {id: "serviceId", type: "hidden"}
                ]}
                saveButtonId = "saveServiceBtn"
            />
        </>
    );
}
