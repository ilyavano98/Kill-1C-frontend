import React from "react";
import {SimpleTablePage} from "../SimpleTablePage";

export function Empoyees() {
    return (
        <>
            <SimpleTablePage
                id="employees"
                title="Сотрудники"
                subtitle="учет персоналав"
                addButtonText="+ Новый сотрудник"
                columns={[
                    { key: 'name', label: 'Имя' },
                    { key: 'phone', label: 'Телефон' },
                    { key: 'role', label: 'Роль' },
                    { key: 'actions', label: 'Действия' }
                ]}
                modalId = "employeeModal"
                tableId = "employeesTbody"
            />
        </>
    );
}
