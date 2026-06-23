import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { getCarWashes, createCarWash, updateCarWash, deleteCarWash } from '../api/api';
import { DataTable } from "./components/DataTable";
import TableEditor from '../components/TableEditor';
import EntityModal from './components/EntityModal';
import { useCrud } from '../hooks/useCrud';
import {useMediaQuery} from "../hooks/useMediaQuery";

const CarWashes = () => {
    // --- Определяем мобильное устройство ---
    const isMobile = useMediaQuery('(max-width: 768px)');

    const initialForm = {
        name: '',
        address: '',
        isActive: true,
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
        getItems: getCarWashes,
        createItem: createCarWash,
        updateItem: updateCarWash,
        deleteItem: deleteCarWash,
        initialForm,
        entityName: 'Мойка',
        transformPayload: (data) => ({
            ...data,
            isActive: Boolean(data.isActive),
        }),
        transformItemForEdit: (item) => ({
            name: item.name || '',
            address: item.address || '',
            isActive: item.isActive !== undefined ? item.isActive : true,
        }),
    });

    // ----- Базовое описание всех возможных колонок -----
    const allColumns = [
        { key: 'name', label: 'Название', filterType: 'text' },
        { key: 'address', label: 'Адрес', filterType: 'text' },
        { key: 'isActive', label: 'Активна', filterType: 'text', format: (val) => (val ? 'Да' : 'Нет') },
    ];

    // ----- Поля для модального окна -----
    const fields = [
        { key: 'name', placeholder: 'Название мойки' },
        { key: 'address', placeholder: 'Адрес' },
        { key: 'isActive', fieldType: 'checkbox', label: 'Активна' },
    ];

    const addButton = <Button onClick={openAdd}>+ Мойка</Button>;

    return (
        <>
            <TableEditor tableName="carwashes" allColumns={allColumns} isMobile={isMobile}>
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
                title={editing ? 'Редактирование мойки' : 'Новая мойка'}
                fields={fields}
                form={form}
                setForm={setForm}
                onSave={save}
                loading={loading}
            />
        </>
    );
};

export default CarWashes;