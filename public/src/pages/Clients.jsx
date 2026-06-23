import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { getClients, createClient, updateClient, deleteClient } from '../api/api';
import { DataTable } from "./components/DataTable";
import TableEditor from '../components/TableEditor';
import EntityModal from './components/EntityModal';
import { useCrud } from '../hooks/useCrud';
import {useMediaQuery} from "../hooks/useMediaQuery";

const Clients = () => {
    // --- Определяем мобильное устройство ---
    const isMobile = useMediaQuery('(max-width: 768px)');

    const initialForm = {
        name: '',
        phone: '',
        email: '',
        preferences: '',
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
        getItems: getClients,
        createItem: createClient,
        updateItem: updateClient,
        deleteItem: deleteClient,
        initialForm,
        entityName: 'Запись о клиенте',
        transformItemForEdit: (item) => ({
            name: item.name || '',
            phone: item.phone || '',
            email: item.email || '',
            preferences: item.preferences || '',
        }),
    });

    const allColumns = [
        { key: 'name', label: 'ФИО', filterType: 'text' },
        { key: 'phone', label: 'Телефон', filterType: 'text' },
        { key: 'email', label: 'Электронная почта', filterType: 'text' },
        { key: 'preferences', label: 'Предпочтения', filterType: 'text'},
    ];

    const fields = [
        { key: 'name', placeholder: 'Имя' },
        { key: 'phone', placeholder: 'Телефон' },
        { key: 'email', placeholder: 'Email' },
        { key: 'preferences', fieldType: 'textarea', placeholder: 'Предпочтения' },
    ];

    const addButton = <Button onClick={openAdd}>+ Клиент</Button>;

    return (
        <>
            <TableEditor tableName="clients" allColumns={allColumns} isMobile={isMobile}>
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
                title={editing ? 'Редактирование клиента' : 'Новый клиент'}
                fields={fields}
                form={form}
                setForm={setForm}
                onSave={save}
                loading={loading}
            />
        </>
    );
};

export default Clients;