import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/api';
import { DataTable } from "./components/DataTable";
import TableEditor from '../components/TableEditor';
import EntityModal from './components/EntityModal';
import { useCrud } from '../hooks/useCrud';
import {useMediaQuery} from "../hooks/useMediaQuery";

const Employees = () => {
    // --- Определяем мобильное устройство ---
    const isMobile = useMediaQuery('(max-width: 768px)');

    const initialForm = {
        name: '',
        phone: '',
        role: '',
    };

    const {
        items,
        loading,
        form,
        setForm,
        show,
        setShow,
        editing,
        save,
        del,
        openEdit,
        openAdd,
    } = useCrud({
        getItems: getEmployees,
        createItem: createEmployee,
        updateItem: updateEmployee,
        deleteItem: deleteEmployee,
        initialForm,
        entityName: 'Сотрудник',
        transformItemForEdit: (item) => ({
            name: item.name || '',
            phone: item.phone || '',
            role: item.role || '',
        }),
    });

    const allColumns = [
        { key: 'name', label: 'Имя', filterType: 'text' },
        { key: 'phone', label: 'Телефон', filterType: 'text' },
        { key: 'role', label: 'Роль', filterType: 'text' },
    ];

    const fields = [
        { key: 'name', placeholder: 'Имя' },
        { key: 'phone', placeholder: 'Телефон' },
        { key: 'role', placeholder: 'Роль' },
    ];

    const addButton = <Button onClick={openAdd}>+ Сотрудник</Button>;

    return (
        <>
            <TableEditor tableName="employees" allColumns={allColumns} isMobile={isMobile}>
                {({ visibleColumns, isEditing, onReorder }) => (
                    <>
                        {loading ? (
                            <div className="text-center my-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2">Загрузка данных...</p>
                            </div>
                        ) : (
                            <DataTable
                                data={items}
                                columns={visibleColumns}
                                idField="id"
                                itemsPerPage={12}
                                addButton={addButton}
                                onEdit={openEdit}
                                onDelete={del}
                                onReorder={onReorder}
                                isMobile={isMobile}
                            />
                        )}
                    </>
                )}
            </TableEditor>

            <EntityModal
                show={show}
                onHide={() => setShow(false)}
                title={editing ? 'Редактирование сотрудника' : 'Новый сотрудник'}
                fields={fields}
                form={form}
                setForm={setForm}
                onSave={save}
                loading={loading}
            />
        </>
    );
};

export default Employees;