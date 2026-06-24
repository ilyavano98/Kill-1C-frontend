import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { getServices, createService, updateService, deleteService } from '../api/api';
import { DataTable } from "./components/DataTable";
import TableEditor from '../components/TableEditor';
import EntityModal from './components/EntityModal';
import { useCrud } from '../hooks/useCrud';
import {useMediaQuery} from "../hooks/useMediaQuery";

const Services = () => {
    // --- Определяем мобильное устройство ---
    const isMobile = useMediaQuery('(max-width: 768px)');

    const initialForm = {
        name: '',
        type: 'мойка',
        price: '',
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
        getItems: getServices,
        createItem: createService,
        updateItem: updateService,
        deleteItem: deleteService,
        initialForm,
        entityName: 'Услуга',
        transformPayload: (data) => ({ ...data, price: Number(data.price) }),
        transformItemForEdit: (item) => ({
            name: item.name || '',
            type: item.type || 'мойка',
            price: item.price || '',
        }),
    });

    const allColumns = [
        { key: 'name', label: 'Название', filterType: 'text' },
        { key: 'type', label: 'Тип', filterType: 'text', format: (val) => (val === 'мойка' ? 'Мойка' : 'Доп. услуга') },
        { key: 'price', label: 'Цена', filterType: 'number', format: (val) => `${val || 0} ₽` },
    ];

    const fields = [
        { key: 'name', placeholder: 'Название' },
        {
            key: 'type',
            fieldType: 'select',
            placeholder: 'Тип услуги',
            options: [
                { value: 'мойка', label: 'Мойка' },
                { value: 'доп', label: 'Доп. услуга' },
            ],
        },
        { key: 'price', fieldType: 'number', placeholder: 'Цена' },
    ];

    const addButton = <Button onClick={openAdd}>+ Услуга</Button>;

    return (
        <>
            <TableEditor tableName="services" allColumns={allColumns} isMobile={isMobile}>
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
                                isEditing={isEditing}
                            />
                        )}
                    </>
                )}
            </TableEditor>

            <EntityModal
                show={show}
                onHide={() => setShow(false)}
                title={editing ? 'Редактирование услуги' : 'Новая услуга'}
                fields={fields}
                form={form}
                setForm={setForm}
                onSave={save}
                loading={loading}
            />
        </>
    );
};

export default Services;