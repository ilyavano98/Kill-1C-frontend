import React, { useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { GearIcon } from './icons/GearIcon';
import { useConfig } from '../hooks/useConfig';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    TouchSensor,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Компонент перетаскиваемого чипа (теперь в виде строки)
const SortableChip = ({ id, label, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        touchAction: 'none',
        padding: '0.3rem 0.6rem',
        background: 'var(--card, #f0f0f0)',
        border: '1px solid var(--glass-border, #ccc)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
        width: '100%',
        boxSizing: 'border-box',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="dnd-chip"
        >
            <span>{label}</span>
            <button
                className="btn btn-sm btn-outline-danger"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(id);
                }}
                style={{ lineHeight: 1, padding: '0 4px', flexShrink: 0 }}
            >
                ✕
            </button>
        </div>
    );
};

const TableEditor = ({ tableName, allColumns, children, isMobile }) => {
    const { draft, setDraftValue, saveConfig, localSaveOnly, cancelEdit: cancelEditHook } = useConfig();
    const [isEditing, setIsEditing] = useState(false);

    const path = `preferences.tables.${tableName}.visibleColumns`;
    const visibleColumnKeys =
        draft?.preferences?.tables?.[tableName]?.visibleColumns ||
        allColumns.map(c => c.key);

    const allColumnKeys = allColumns.map(c => c.key);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const removeColumn = (key) => {
        const newVisible = visibleColumnKeys.filter(k => k !== key);
        setDraftValue(path, newVisible);
    };

    const addColumn = (key) => {
        if (!visibleColumnKeys.includes(key)) {
            setDraftValue(path, [...visibleColumnKeys, key]);
        }
    };

    const handleReorder = (newOrder) => {
        setDraftValue(path, newOrder);
    };

    const handleChipDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = visibleColumnKeys.indexOf(active.id);
            const newIndex = visibleColumnKeys.indexOf(over.id);
            const newOrder = arrayMove(visibleColumnKeys, oldIndex, newIndex);
            setDraftValue(path, newOrder);
        }
    };

    const toggleEdit = () => setIsEditing(prev => !prev);

    const cancelEdit = () => {
        cancelEditHook();
        setIsEditing(false);
    };

    const save = () => {
        saveConfig(draft);
        setIsEditing(false);
    };

    const localSave = () => {
        localSaveOnly();
        setIsEditing(false);
    };

    const processedColumns = visibleColumnKeys
        .map(key => allColumns.find(col => col.key === key))
        .filter(Boolean)
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
                <div className="mb-3 p-2 border rounded">
                    {isMobile ? (
                        // Мобильная версия — чипсы в вертикальный список с анимацией
                        <div className="mb-2">
                            <span className="me-2 d-block mb-1">Порядок колонок (перетащите):</span>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleChipDragEnd}
                            >
                                <SortableContext
                                    items={visibleColumnKeys}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="d-flex flex-column gap-2">
                                        {visibleColumnKeys.map(key => {
                                            const label = allColumns.find(c => c.key === key)?.label || key;
                                            return (
                                                <SortableChip
                                                    key={key}
                                                    id={key}
                                                    label={label}
                                                    onRemove={removeColumn}
                                                />
                                            );
                                        })}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>
                    ) : (
                        // ПК версия — подсказка
                        <div className="mb-2">
                            <span className="me-2">Перетащите заголовки колонок, чтобы изменить порядок</span>
                        </div>
                    )}

                    <div className="d-flex gap-2 align-items-center mt-2">
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
                </div>
            )}

            {children({
                visibleColumns: processedColumns,
                isEditing,
                isMobile,
                onReorder: isEditing ? handleReorder : null,
            })}
        </>
    );
};

export default TableEditor;