import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// --- Дефолтная конфигурация (полный скелет) ---
export const DEFAULT_CONFIG = {
    preferences: {
        theme: {
            primaryColor: '#2563eb',
            sidebarColor: '#0f172a',
        },
        tables: {
            appointments: {
                visibleColumns: ['dateTime', 'clientId', 'carId', 'serviceId', 'employeeId', 'status', 'washBayId', 'price'],
            },
            carWashes: {
                visibleColumns: ['name', 'address', 'isActive'],
            },
            clients: {
                visibleColumns: ['id', 'name', 'phone', 'email'],
            },
            dashBoard: {
                visibleColumns: [],
            },
            employees: {
                visibleColumns: ['name', 'phone', 'role'],
            },
            loadDashboard: {
                visibleColumns: [],
            },
            services: {
                visibleColumns: ['name', 'type', 'price'],
            },
            shifts: {
                visibleColumns: ['employee', 'start', 'end', 'carsCount'],
            },
            washBays: {
                visibleColumns: ['name', 'carWashId', 'isActive'],
            },
        },
        labels: {
            dashboardTitle: 'Панель управления',
            appointmentsTab: 'Записи',
        },
    },
};

// --- Вспомогательные функции ---
function computeDelta(oldFull, newFull) {
    const delta = {};
    const traverse = (newObj, oldObj, path = '') => {
        for (const key in newObj) {
            if (!Object.prototype.hasOwnProperty.call(newObj, key)) continue;
            const newVal = newObj[key];
            const oldVal = oldObj?.[key];
            const currentPath = path ? `${path}.${key}` : key;
            if (typeof newVal === 'object' && newVal !== null && !Array.isArray(newVal)) {
                traverse(newVal, oldVal, currentPath);
            } else if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                delta[currentPath] = newVal;
            }
        }
    };
    traverse(newFull, oldFull);
    return delta;
}

// --- Асинхронные загрузки конфигов и сохранения ---
export const loadConfig = createAsyncThunk(
    'config/load',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/config');
            return response.data || DEFAULT_CONFIG;
        } catch (err) {
            if (err.response?.status === 404) {
                return DEFAULT_CONFIG;
            }
            return rejectWithValue(err.response?.data);
        }
    }
);

export const saveConfigs = createAsyncThunk(
    'config/save',
    async (draftConfig, { getState, rejectWithValue }) => {
        try {
            const oldConfig = getState().config.config;
            const delta = computeDelta(oldConfig, draftConfig);
            if (Object.keys(delta).length === 0) {
                return draftConfig; // ничего не менялось
            }
            await api.patch('/user/config', delta);
            return draftConfig;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// --- Слайс ---
const configSlice = createSlice({
    name: 'config',
    initialState: {
        config: DEFAULT_CONFIG,          // опубликованная
        draftConfig: DEFAULT_CONFIG,     // редактируемая копия
        isEditing: false,                // режим редактирования включён?
        loading: 'idle',
        error: null,
    },
    reducers: {
        // Войти в режим редактирования: копируем config в draft
        startEditing(state) {
            state.isEditing = true;
            state.draftConfig = JSON.parse(JSON.stringify(state.config)); // глубокое копирование
        },
        // Отменить редактирование: сбросить draft и выйти
        cancelEditing(state) {
            state.isEditing = false;
            state.draftConfig = JSON.parse(JSON.stringify(state.config));
            state.error = null;
        },
        // Обновить черновик (любое поле)
        updateDraft(state, action) {
            // action.payload — объект с изменениями (может быть вложенным)
            state.draftConfig = mergeDeep(state.draftConfig, action.payload);
        },
        // Сброс к дефолту (опционально)
        resetToDefault(state) {
            state.config = DEFAULT_CONFIG;
            state.draftConfig = DEFAULT_CONFIG;
            state.isEditing = false;
        },
        // Локальное сохранение (без бэка) — для тестирования
        localSave(state) {
            state.config = JSON.parse(JSON.stringify(state.draftConfig));
            state.isEditing = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadConfig.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(loadConfig.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.config = action.payload;
                state.draftConfig = action.payload;
                state.isEditing = false;
                state.error = null;
            })
            .addCase(loadConfig.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
                // оставляем дефолт
            })
            .addCase(saveConfigs.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(saveConfigs.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.config = action.payload;
                state.draftConfig = action.payload;
                state.isEditing = false;
                state.error = null;
            })
            .addCase(saveConfigs.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
                // draft остаётся, чтобы пользователь мог поправить и сохранить снова
            });
    },
});

// Утилита глубокого слияния
function mergeDeep(target, source) {
    const result = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = mergeDeep(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

export const { startEditing, cancelEditing, updateDraft, resetToDefault, localSave } = configSlice.actions;
export default configSlice.reducer;