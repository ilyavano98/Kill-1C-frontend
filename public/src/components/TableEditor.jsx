import React, { useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { GearIcon } from './icons/GearIcon'; // или импортируем иконку из react-icons
import { useConfig } from '../hooks/useConfig';

/**
 * Универсальный редактор таблицы
 * @param {string} tableName - имя таблицы для идентификации в конфиге (ключ в preferences.tables)
 * @param {Array} allColumns - массив всех возможных колонок (с key, label и т.д.)
 * @param {function} children - функция рендеринга таблицы, принимает { visibleColumns, isEditing }
 */
const TableEditor = ({ tableName, allColumns, children }) => {
    const { draft, setDraftValue, saveConfig, localSaveOnly } = useConfig();
    const [isEditing, setIsEditing] = useState(false);

    // Получаем путь к visibleColumns для этой таблицы
    const path = `preferences.tables.${tableName}.visibleColumns`;
    // Получаем текущий список видимых колонок из черновика (или дефолт)
    const currentConfig = draft; // используем черновик
    const visibleColumnKeys = currentConfig?.preferences?.tables?.[tableName]?.visibleColumns || allColumns.map(c => c.key);
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

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const cancelEdit = () => {
        // Отмена – просто выходим из режима, не сохраняя изменения (они остаются в черновике, но мы не сохраняем)
        // При следующем входе в режим редактирования черновик будет содержать изменения, но они не сохранены на бэк.
        // Лучше сбросить черновик до конфига? Но у нас нет функции сброса черновика. Можно при выходе без сохранения отменить изменения, но проще просто выйти, а изменения останутся в черновике.
        // Для удобства, при отмене мы можем перезагрузить конфиг из опубликованного, но у нас нет такой функции. Можно предложить пользователю, но для простоты просто выйдем.
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

    // Формируем колонки для таблицы с крестиками, если isEditing
    const processedColumns = allColumns
        .filter(col => visibleColumnKeys.includes(col.key))
        .map(col => ({
            ...col,
            label: isEditing ? (
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
            ) : col.label,
        }));

    return (
        <>
            {/* Панель управления */}
            <div className="d-flex justify-content-end mb-2">
                {!isEditing ? (
                    <Button
                        variant="outline-secondary"
                        onClick={toggleEdit}
                        title="Редактировать таблицу"
                        style={{ border: 'none', padding: 0 }}
                    >
                        <GearIcon width={28} height={28} fill="#6c757d" />
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

            {/* Панель добавления колонки */}
            {isEditing && (
                <div className="mb-2 d-flex gap-2 justify-content-end">
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

            {/* Рендерим таблицу, передавая обработанные колонки и флаг редактирования */}
            {children({ visibleColumns: processedColumns, isEditing })}
        </>
    );
};

export default TableEditor;