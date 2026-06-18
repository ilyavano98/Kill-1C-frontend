import React, { useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { GearIcon } from './icons/GearIcon'; // или импортируем иконку из react-icons
import { useConfig } from '../hooks/useConfig';

const TableEditor = ({ tableName, allColumns, children }) => {
    const { draft, setDraftValue, saveConfig, localSaveOnly } = useConfig();
    const [isEditing, setIsEditing] = useState(false);

    const path = `preferences.tables.${tableName}.visibleColumns`;
    const visibleColumnKeys =
        draft?.preferences?.tables?.[tableName]?.visibleColumns ||
        allColumns.map(c => c.key);

    const allColumnKeys = allColumns.map(c => c.key);

    const removeColumn = (key) => {
        const newVisible = visibleColumnKeys.filter(k => k !== key);
        setDraftValue(path, newVisible);
    };

    const addColumn = (key) => {
        if (!visibleColumnKeys.includes(key)) {
            setDraftValue(path, [...visibleColumnKeys, key]);
        }
    };

    const toggleEdit = () => setIsEditing(prev => !prev);
    const cancelEdit = () => setIsEditing(false);

    const save = () => {
        saveConfig(draft);
        setIsEditing(false);
    };

    const localSave = () => {
        localSaveOnly();
        setIsEditing(false);
    };

    // Формируем колонки: добавляем поле `header`, если режим редактирования
    const processedColumns = allColumns
        .filter(col => visibleColumnKeys.includes(col.key))
        .map(col => ({
            ...col,
            header: isEditing ? (
                <div className="d-flex align-items-center justify-content-between">
                    <span>{col.label}</span>
                    <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeColumn(col.key);
                        }}
                        style={{ lineHeight: 1, padding: '2px 6px' }}
                    >
                        ✕
                    </button>
                </div>
            ) : undefined,
        }));

    return (
        <>
            <div className="d-flex justify-content-end mb-2">
                {!isEditing ? (
                    <Button
                        variant="outline-secondary"
                        onClick={toggleEdit}
                        title="Редактировать таблицу"
                        style={{ border: 'none', padding: 0 }}
                    >
                        <GearIcon size={28} color="#6c757d" />
                    </Button>
                ) : (
                    <div>
                        <Button variant="secondary" onClick={cancelEdit} size="sm" className="me-2">
                            Отмена
                        </Button>
                        <Button variant="success" onClick={save} size="sm" className="me-2">
                            Сохранить
                        </Button>
                        <Button variant="info" onClick={localSave} size="sm">
                            Локально
                        </Button>
                    </div>
                )}
            </div>

            {isEditing && (
                <div className="mb-3 p-2 border rounded d-flex flex-wrap gap-2 justify-content-end">
                    <span>Добавить колонку:</span>
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                            Выбрать
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {allColumnKeys
                                .filter(key => !visibleColumnKeys.includes(key))
                                .map(key => (
                                    <Dropdown.Item key={key} onClick={() => addColumn(key)}>
                                        {allColumns.find(c => c.key === key)?.label || key}
                                    </Dropdown.Item>
                                ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            )}

            {children({ visibleColumns: processedColumns, isEditing })}
        </>
    );
};

export default TableEditor;