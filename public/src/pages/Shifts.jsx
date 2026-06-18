import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { getShifts, getEmployees, createShift, updateShift, deleteShift } from '../api/api';
import { DataTable } from "./components/DataTable";
import TableEditor from '../components/TableEditor';
import EntityModal from './components/EntityModal';
import { useCrud } from '../hooks/useCrud';

const Shifts = () => {
    // --- Данные для формы ---
    const initialForm = {
        date: '',
        employeeId: '',
        start: '',
        end: '',
        carsCount: '',
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
        getItems: getShifts,
        createItem: createShift,
        updateItem: updateShift,
        deleteItem: deleteShift,
        initialForm,
        entityName: 'Смена',
        transformPayload: (data) => ({ ...data, carsCount: Number(data.carsCount) }),
        transformItemForEdit: (item) => ({
            date: item.date || '',
            employeeId: item.employeeId || '',
            start: item.start || '',
            end: item.end || '',
            carsCount: item.carsCount || '',
        }),
    });

    // --- Загрузка сотрудников (для select) ---
    const [employees, setEmployees] = React.useState([]);
    React.useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await getEmployees();
                setEmployees(Array.isArray(data) ? data : data?.data || []);
            } catch (e) {
                console.error('LOAD EMPLOYEES ERROR:', e);
            }
        };
        loadEmployees();
    }, []);

    // ----- Функция получения имени сотрудника -----
    const getEmployeeName = (id) => employees.find(e => e.id === id)?.name || id || '—';

    // ----- Базовое описание всех возможных колонок -----
    const allColumns = [
        { key: 'date', label: 'Дата', filterType: 'date' },
        {
            key: 'employee',
            label: 'Сотрудник',
            filterType: 'text',
            getDisplayValue: (item) => getEmployeeName(item.employeeId),
        },
        { key: 'start', label: 'Начало', filterType: 'text' },
        { key: 'end', label: 'Конец', filterType: 'text' },
        { key: 'carsCount', label: 'Количество автомобилей', filterType: 'number' },
    ];

    // ----- Поля для модального окна -----
    const fields = [
        { key: 'date', fieldType: 'date', placeholder: 'Дата' },
        {
            key: 'employeeId',
            fieldType: 'select',
            placeholder: 'Выберите сотрудника',
            options: employees.map(e => ({ value: e.id, label: e.name })),
        },
        { key: 'start', fieldType: 'time', placeholder: 'Начало' },
        { key: 'end', fieldType: 'time', placeholder: 'Конец' },
        { key: 'carsCount', fieldType: 'number', placeholder: 'Авто обработано' },
    ];

    const addButton = <Button onClick={openAdd}>+ Смена</Button>;

    return (
        <>
            <TableEditor tableName="shifts" allColumns={allColumns}>
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
                title={editing ? 'Редактирование смены' : 'Новая смена'}
                fields={fields}
                form={form}
                setForm={setForm}
                onSave={save}
                loading={loading}
            />
        </>
    );
};

export default Shifts;