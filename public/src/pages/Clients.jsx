import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { getClients, createClient, updateClient, deleteClient } from '../api/api';
import { DataTable } from "./components/DataTable";
import TableEditor from '../components/TableEditor';
import EntityModal from './components/EntityModal';
import { useCrud } from '../hooks/useCrud';

const Clients = () => {
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
        entityName: 'Клиент',
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
            <TableEditor tableName="clients" allColumns={allColumns}>
                {({ visibleColumns }) => (
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