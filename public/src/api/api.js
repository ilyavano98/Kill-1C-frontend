import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: apiUrl + '/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Перехватчик для превращения объекта в массив
api.interceptors.response.use(
  (response) => {
    const listEndpoints = ['/clients', '/cars', '/services', '/employees', '/appointments', '/shifts', '/carwashes', '/washbays', '/appointments/recent'];
    const isListEndpoint = listEndpoints.some(endpoint => response.config.url.includes(endpoint));
    
    if (isListEndpoint && !Array.isArray(response.data)) {
      console.warn(`API вернул объект вместо массива для ${response.config.url}, преобразуем в массив`);
      return { ...response, data: [response.data] };
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// Клиенты
export const getClients = () => api.get('/clients');
export const createClient = (data) => api.post('/clients', data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/clients/${id}`);

// Автомобили
export const getCars = () => api.get('/cars');
export const createCar = (data) => api.post('/cars', data);
export const updateCar = (id, data) => api.put(`/cars/${id}`, data);
export const deleteCar = (id) => api.delete(`/cars/${id}`);

// Услуги
export const getServices = () => api.get('/services');
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

// Сотрудники
export const getEmployees = () => api.get('/employees');
export const createEmployee = (data) => api.post('/employees', data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Записи
export const getAppointments = (params) => api.get('/appointments', { params });
export const getRecentAppointments = () => api.get('/appointments/recent');
export const createAppointment = (data) => api.post('/appointments', data);
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

// Смены
export const getShifts = () => api.get('/shifts');
export const createShift = (data) => api.post('/shifts', data);
export const updateShift = (id, data) => api.put(`/shifts/${id}`, data);
export const deleteShift = (id) => api.delete(`/shifts/${id}`);

// Автомойки
export const getCarWashes = () => api.get('/carwashes');
export const createCarWash = (data) => api.post('/carwashes', data);
export const updateCarWash = (id, data) => api.put(`/carwashes/${id}`, data);
export const deleteCarWash = (id) => api.delete(`/carwashes/${id}`);

// Моечные места
export const getWashBays = () => api.get('/washbays');
export const createWashBay = (data) => api.post('/washbays', data);
export const updateWashBay = (id, data) => api.put(`/washbays/${id}`, data);
export const deleteWashBay = (id) => api.delete(`/washbays/${id}`);

// Дашборд
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getDashboardCharts = () => api.get('/dashboard/charts');
export const getLoadDashboard = (date) => api.get('/load-dashboard', { params: { date } });

// Поиск
export const search = (query) => api.get('/search', { params: { q: query } });