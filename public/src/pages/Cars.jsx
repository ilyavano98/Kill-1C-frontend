import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { getCars, getClients, createCar, updateCar, deleteCar } from '../api/api';
import { DataTable } from "./components/DataTable";
import TableEditor from '../components/TableEditor';
import { useCrud } from '../hooks/useCrud';
import EntityModal from "./components/EntityModal";

const Cars = () => {
    // --- Данные для формы ---
    const initialForm = {
        clientIds: [],
        plate: '',
        brand: '',
        model: '',
        year: '',
        bodyType: 'седан',
    };

    // --- Используем хук useCrud ---
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
        getItems: getCars,
        createItem: createCar,
        updateItem: updateCar,
        deleteItem: deleteCar,
        initialForm,
        entityName: 'Автомобиль',
        transformPayload: (data) => ({ ...data, year: Number(data.year) }),
        transformItemForEdit: (item) => ({
            clientIds: item.clientIds || [],
            plate: item.plate || '',
            brand: item.brand || '',
            model: item.model || '',
            year: item.year || '',
            bodyType: item.bodyType || 'седан',
        }),
    });

    // --- Загрузка клиентов (для select) ---
    const [clients, setClients] = React.useState([]);
    React.useEffect(() => {
        const loadClients = async () => {
            try {
                const data = await getClients();
                setClients(Array.isArray(data) ? data : data?.data || []);
            } catch (e) {
                console.error('LOAD CLIENTS ERROR:', e);
            }
        };
        loadClients();
    }, []);

    // ----- Функция отображения владельцев -----
    const getCarOwnersValue = (clientIds) =>
        clientIds
            .map(clientId => clients.find(client => client.id === clientId)?.name || '—')
            .join(', ');

    // ----- Колонки -----
    const allColumns = [
        { key: 'plate', label: 'Госномер', filterType: 'text' },
        { key: 'brand', label: 'Марка', filterType: 'text' },
        { key: 'model', label: 'Модель', filterType: 'text' },
        { key: 'year', label: 'Год', filterType: 'text' },
        { key: 'bodyType', label: 'Тип', filterType: 'text' },
        { key: 'carOwner', label: 'Владельцы', filterType: 'text', getDisplayValue: (item) => getCarOwnersValue(item.clientIds) },
    ];

    // ----- Поля для модального окна -----
    const fields = [
        { key: 'plate', placeholder: 'Госномер' },
        { key: 'brand', placeholder: 'Марка' },
        { key: 'model', placeholder: 'Модель' },
        { key: 'year', fieldType: 'number', placeholder: 'Год' },
        {
            key: 'bodyType',
            fieldType: 'select',
            placeholder: 'Тип кузова',
            options: [
                { value: 'седан', label: 'Седан' },
                { value: 'внедорожник', label: 'Внедорожник' },
                { value: 'хэтчбек', label: 'Хэтчбек' },
            ],
        },
        {
            key: 'clientIds',
            fieldType: 'selectMultiple',
            placeholder: 'Владельцы',
            options: clients.map(c => ({ value: c.id, label: c.name })),
        },
    ];

    const addButton = <Button onClick={openAdd}>+ Авто</Button>;

    return (
        <>
            <TableEditor tableName="cars" allColumns={allColumns}>
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
                title={editing ? 'Редактирование автомобиля' : 'Новый автомобиль'}
                fields={fields}
                form={form}
                setForm={setForm}
                onSave={save}
                loading={loading}
            />
        </>
    );
};

export default Cars;