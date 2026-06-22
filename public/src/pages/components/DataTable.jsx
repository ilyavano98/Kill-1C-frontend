import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

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
    const [filterColumn, setFilterColumn] = useState('');
    const [filterValues, setFilterValues] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const getDisplayValue = (item, col) => {
        if (col.getDisplayValue) return col.getDisplayValue(item);
        const raw = item[col.key];
        return col.format ? col.format(raw) : raw;
    };

    const filteredData = data.filter(item => {
        for (const [key, value] of Object.entries(customFilters)) {
            if (value && value !== '' && item[key] !== value) return false;
        }
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
            const itemDate = new Date(item[filterColumn]);
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
        return displayValue.includes(search);
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterColumn, filterValues,/* customFilters*/]);

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

    const resetFilter = () => {
        setFilterColumn('');
        setFilterValues({});
    };

    const handleFilterChange = (value) => {
        setFilterValues(prev => ({ ...prev, [filterColumn]: value }));
    };

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
                        <Form.Control type="datetime-local" placeholder="От" value={value.from || ''} onChange={e => handleFilterChange({ ...value, from: e.target.value })} />
                        <Form.Control type="datetime-local" placeholder="До" value={value.to || ''} onChange={e => handleFilterChange({ ...value, to: e.target.value })} />
                    </div>
                );
            case 'number':
                return (
                    <div className="d-flex gap-2">
                        <Form.Control type="number" placeholder="Цена от" value={value.min || ''} onChange={e => handleFilterChange({ ...value, min: e.target.value })} />
                        <Form.Control type="number" placeholder="Цена до" value={value.max || ''} onChange={e => handleFilterChange({ ...value, max: e.target.value })} />
                    </div>
                );
            case 'select':
                const options = col.filterOptions || [];
                return (
                    <Form.Select value={value || ''} onChange={e => handleFilterChange(e.target.value)}>
                        <option value="">Все</option>
                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </Form.Select>
                );
            default:
                return <Form.Control type="text" placeholder="Поиск..." value={value || ''} onChange={e => handleFilterChange(e.target.value)} />;
        }
    };

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
                                {filterableColumns.map(col => <option key={col.key} value={col.key}>{col.label}</option>)}
                            </Form.Select>
                        </div>
                        {filterColumn && (
                            <div style={{ flex: 1, minWidth: '250px' }}>{renderFilterInputs()}</div>
                        )}
                        {filterColumn && (
                            <Button variant="outline-secondary" onClick={resetFilter}>Сбросить фильтр</Button>
                        )}
                    </>
                )}
            </div>

            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    {columns.map(col => <th key={col.key}>{col.header || col.label}</th>)}
                    {(onEdit || onDelete) && <th></th>}
                </tr>
                </thead>
                <tbody>
                {currentItems.map(item => (
                    <tr key={item[idField]}>
                        {columns.map(col => <td key={col.key}>{getDisplayValue(item, col) || '—'}</td>)}
                        {(onEdit || onDelete) && (
                            <td>
                                {onEdit && <Button size="sm" variant="warning" onClick={() => onEdit(item)} className="me-1">✏️</Button>}
                                {onDelete && <Button size="sm" variant="danger" onClick={() => onDelete(item[idField])}>🗑️</Button>}
                            </td>
                        )}
                    </tr>
                ))}
                {currentItems.length === 0 && (
                    <tr><td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center">Нет данных</td></tr>
                )}
                </tbody>
            </Table>

            {/* === УЛУЧШЕННАЯ ПАГИНАЦИЯ === */}
            {filteredData.length > 0 && (
                <div className="pagination-wrapper">
                    <div className="pagination-info">
                        {filteredData.length > 0 && (
                            <span className="pagination-range">
                {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredData.length)} из {filteredData.length}
              </span>
                        )}
                    </div>
                    <div className="pagination-controls">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className="pagination-btn"
                        >
                            <span className="d-none d-sm-inline">Назад</span>
                            <span className="d-inline d-sm-none">←</span>
                        </Button>
                        <span className="pagination-page">
              Страница {currentPage} из {totalPages}
            </span>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="pagination-btn"
                        >
                            <span className="d-none d-sm-inline">Вперед</span>
                            <span className="d-inline d-sm-none">→</span>
                        </Button>
                        <Form.Control
                            type="number"
                            min={1}
                            max={totalPages}
                            value={currentPage}
                            onChange={e => goToPage(e.target.value)}
                            className="pagination-input"
                        />
                    </div>
                </div>
            )}
        </>
    );
};