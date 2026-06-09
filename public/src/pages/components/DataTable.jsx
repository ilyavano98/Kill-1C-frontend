import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import {getDateObject} from "../../functions/Functions";

/**
 * Универсальная таблица с фильтрацией и пагинацией
 * @param {Array} data - исходные данные
 * @param {Array} columns - конфигурация колонок:
 *   { key, label, filterType?, format?, getDisplayValue?, filterOptions? }
 * @param {string} idField - поле с уникальным идентификатором
 * @param {number} itemsPerPage - записей на страницу (по умолчанию 12)
 * @param {ReactNode} addButton - кнопка добавления (опционально)
 * @param {function} onEdit - функция редактирования (получает элемент)
 * @param {function} onDelete - функция удаления (получает id)
 * @param {object} customFilters - дополнительные внешние фильтры (например, по статусу)
 */
export const DataTable = ({
                       data = [],
                       columns = [],
                       idField = 'id',
                       itemsPerPage = 12,
                       addButton = null,
                       onEdit = null,
                       onDelete = null,
                       customFilters = {}
                   }) => {
    // Состояния для фильтра (аналогично исходному)
    const [filterColumn, setFilterColumn] = useState('');
    const [filterValues, setFilterValues] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    // Функция получения отображаемого значения для элемента и колонки
    const getDisplayValue = (item, col) => {
        if (col.getDisplayValue) return col.getDisplayValue(item);
        const raw = item[col.key];
        return col.format ? col.format(raw) : raw;
    };

    // Фильтрация данных
    const filteredData = data.filter(item => {
        // Проверяем пользовательские фильтры (переданные снаружи)
        for (const [key, value] of Object.entries(customFilters)) {
            if (value && value !== '' && item[key] !== value) return false;
        }

        // Если фильтр по колонке не выбран или не заданы значения, пропускаем
        if (!filterColumn) return true;
        const filterVal = filterValues[filterColumn];
        if (!filterVal || filterVal === '') return true;

        const col = columns.find(c => c.key === filterColumn);
        if (!col) return true;

        const displayValue = String(getDisplayValue(item, col)).toLowerCase();
        const search = String(filterVal).toLowerCase();

        if (col.filterType === 'date') {
            const { from, to } = filterVal;
            if (!from && !to) return true;
            const itemDate = new Date(getDateObject(item.dateTime));
            if (from && itemDate < new Date(from)) return false;
            if (to && itemDate > new Date(to)) return false;
            return true;
        }
        if (col.filterType === 'number') {
            const num = Number(item[filterColumn]);
            if (filterVal.min !== undefined && filterVal.min !== '' && num < Number(filterVal.min)) return false;
            if (filterVal.max !== undefined && filterVal.max !== '' && num > Number(filterVal.max)) return false;
            return true;
        }
        if (col.filterType === 'select') {
            return displayValue === search;
        }
        // text / default
        return displayValue.includes(search);
    });

    // Пагинация
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Сброс страницы только при изменении фильтра (колонка или значение)
    useEffect(() => {
        setCurrentPage(1);
    }, [filterColumn, filterValues, customFilters]);

    // Не сбрасываем страницу при изменении data.length (чтобы пагинация работала без отката)
    // Добавление/удаление записей через кнопки вызовет перезагрузку данных, и тогда data.length изменится,
    // но этот эффект не реагирует на data.length. Вручную сбросим страницу при успешной загрузке данных в родителе,
    // либо можно добавить отдельный эффект, но лучше обрабатывать в родителе (например, после load сбросить page на 1).

    // Однако если данные изменились (например, добавили запись), нужно сбросить страницу.
    // Сделаем отдельный эффект, который сработает при изменении длины данных,
    // но будем сбрасывать только если новая длина меньше или равна предыдущей?
    // Проще всего: оставить как есть, но добавить key или дополнительный флаг.
    // Для надёжности добавим useEffect на data.length, но с условием, что сбрасываем только если изменились фильтры,
    // но фильтры не менялись. Ладно, допустим, что родитель может сам сбросить страницу через проп.
    // Добавим ref для предотвращения лишних сбросов.
    const prevDataLength = React.useRef(data.length);
    useEffect(() => {
        if (prevDataLength.current !== data.length) {
            setCurrentPage(1);
            prevDataLength.current = data.length;
        }
    }, [data.length]);

    const goToPrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
    const goToNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
    const goToPage = (page) => {
        let p = Number(page);
        if (isNaN(p)) p = 1;
        setCurrentPage(Math.min(Math.max(1, p), totalPages));
    };

    // Сброс фильтра
    const resetFilter = () => {
        setFilterColumn('');
        setFilterValues({});
    };

    // Обработчик изменения полей фильтра для выбранной колонки
    const handleFilterChange = (value) => {
        setFilterValues(prev => ({ ...prev, [filterColumn]: value }));
    };

    // Рендер полей фильтра для выбранной колонки
    const renderFilterInputs = () => {
        if (!filterColumn) return null;
        const col = columns.find(c => c.key === filterColumn);
        if (!col) return null;
        const value = filterValues[filterColumn] || (col.filterType === 'date' ? { from: '', to: '' } :
            col.filterType === 'number' ? { min: '', max: '' } : '');

        switch (col.filterType) {
            case 'date':
                return (
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="datetime-local"
                            placeholder="От"
                            value={value.from || ''}
                            onChange={e => handleFilterChange({ ...value, from: e.target.value })}
                        />
                        <Form.Control
                            type="datetime-local"
                            placeholder="До"
                            value={value.to || ''}
                            onChange={e => handleFilterChange({ ...value, to: e.target.value })}
                        />
                    </div>
                );
            case 'number':
                return (
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="number"
                            placeholder="Цена от"
                            value={value.min || ''}
                            onChange={e => handleFilterChange({ ...value, min: e.target.value })}
                        />
                        <Form.Control
                            type="number"
                            placeholder="Цена до"
                            value={value.max || ''}
                            onChange={e => handleFilterChange({ ...value, max: e.target.value })}
                        />
                    </div>
                );
            case 'select':
                const options = col.filterOptions || [];
                return (
                    <Form.Select
                        value={value || ''}
                        onChange={e => handleFilterChange(e.target.value)}
                    >
                        <option value="">Все</option>
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </Form.Select>
                );
            default: // text
                return (
                    <Form.Control
                        type="text"
                        placeholder="Поиск..."
                        value={value || ''}
                        onChange={e => handleFilterChange(e.target.value)}
                    />
                );
        }
    };

    // Доступные для фильтрации колонки (те, у которых указан filterType)
    const filterableColumns = columns.filter(col => col.filterType);

    return (
        <>
            <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                {addButton && <div>{addButton}</div>}

                {filterableColumns.length > 0 && (
                    <>
                        <div style={{ minWidth: '200px' }}>
                            <Form.Select value={filterColumn} onChange={e => setFilterColumn(e.target.value)}>
                                <option value="">Фильтровать по...</option>
                                {filterableColumns.map(col => (
                                    <option key={col.key} value={col.key}>{col.label}</option>
                                ))}
                            </Form.Select>
                        </div>

                        {filterColumn && (
                            <div style={{ flex: 1, minWidth: '250px' }}>
                                {renderFilterInputs()}
                            </div>
                        )}

                        {filterColumn && (
                            <Button variant="outline-secondary" onClick={resetFilter}>
                                Сбросить фильтр
                            </Button>
                        )}
                    </>
                )}
            </div>

            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    {columns.map(col => (
                        <th key={col.key}>{col.label}</th>
                    ))}
                    {(onEdit || onDelete) && <th></th>}
                </tr>
                </thead>
                <tbody>
                {currentItems.map(item => (
                    <tr key={item[idField]}>
                        {columns.map(col => (
                            <td key={col.key}>{getDisplayValue(item, col) || '—'}</td>
                        ))}
                        {(onEdit || onDelete) && (
                            <td>
                                {onEdit && (
                                    <Button size="sm" variant="warning" onClick={() => onEdit(item)} className="me-1">
                                        ✏️
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button size="sm" variant="danger" onClick={() => onDelete(item[idField])}>
                                        🗑️
                                    </Button>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
                {currentItems.length === 0 && (
                    <tr>
                        <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center">
                            Нет данных
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>

            {filteredData.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        Показано {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredData.length)} из {filteredData.length} записей
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="outline-secondary" onClick={goToPrevPage} disabled={currentPage === 1}>
                            ← Назад
                        </Button>
                        <span className="align-self-center">Страница {currentPage} из {totalPages}</span>
                        <Button variant="outline-secondary" onClick={goToNextPage} disabled={currentPage === totalPages}>
                            Вперед →
                        </Button>
                        <Form.Control
                            type="number"
                            min={1}
                            max={totalPages}
                            value={currentPage}
                            onChange={e => goToPage(e.target.value)}
                            style={{ width: '70px' }}
                            className="text-center"
                        />
                    </div>
                </div>
            )}
        </>
    );
};