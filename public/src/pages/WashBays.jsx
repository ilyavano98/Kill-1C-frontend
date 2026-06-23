import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { getWashBays, getCarWashes, createWashBay, updateWashBay, deleteWashBay } from '../api/api';
import { DataTable } from "./components/DataTable";
import TableEditor from '../components/TableEditor';
import EntityModal from './components/EntityModal';
import { useCrud } from '../hooks/useCrud';
import {useMediaQuery} from "../hooks/useMediaQuery";

const WashBays = () => {
    // --- Определяем мобильное устройство ---
    const isMobile = useMediaQuery('(max-width: 768px)');

    const initialForm = {
        carWashId: '',
        name: '',
        description: '',
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
        getItems: getWashBays,
        createItem: createWashBay,
        updateItem: updateWashBay,
        deleteItem: deleteWashBay,
        initialForm,
        entityName: 'Место',
        transformPayload: (data) => ({ ...data, isActive: Boolean(data.isActive) }),
        transformItemForEdit: (item) => ({
            carWashId: item.carWashId || '',
            name: item.name || '',
            description: item.description || '',
            isActive: item.isActive !== undefined ? item.isActive : true,
        }),
    });

    const [carwashes, setCarwashes] = React.useState([]);
    React.useEffect(() => {
        const load = async () => {
            try {
                const data = await getCarWashes();
                setCarwashes(Array.isArray(data) ? data : data?.data || []);
            } catch (e) {
                console.error('LOAD CARWASHES ERROR:', e);
            }
        };
        load();
    }, []);

    const getWashValue = (id) => carwashes.find(c => c.id === id)?.name || id || '—';

    const allColumns = [
        { key: 'name', label: 'Название', filterType: 'text' },
        {
            key: 'carWashId',
            label: 'Автомойка',
            filterType: 'text',
            getDisplayValue: (item) => getWashValue(item.carWashId),
        },
        { key: 'isActive', label: 'Активно', filterType: 'text', format: (val) => (val ? 'Да' : 'Нет') },
    ];

    const fields = [
        {
            key: 'carWashId',
            fieldType: 'select',
            placeholder: 'Выберите мойку',
            options: carwashes.map(cw => ({ value: cw.id, label: cw.name })),
        },
        { key: 'name', placeholder: 'Название места' },
        { key: 'description', placeholder: 'Описание' },
        { key: 'isActive', fieldType: 'checkbox', label: 'Активно' },
    ];

    const addButton = <Button onClick={openAdd}>+ Место</Button>;

    return (
        <>
            <TableEditor tableName="washbays" allColumns={allColumns} isMobile={isMobile}>
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
                title={editing ? 'Редактирование места' : 'Новое место'}
                fields={fields}
                form={form}
                setForm={setForm}
                onSave={save}
                loading={loading}
            />
        </>
    );
};

export default WashBays;