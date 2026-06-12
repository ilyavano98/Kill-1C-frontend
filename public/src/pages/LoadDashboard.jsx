import React, { useState, useEffect } from 'react';
import { getLoadDashboard } from '../api/api';
import {Spinner} from "react-bootstrap";
import {DataTable} from "./components/DataTable";

const LoadDashboard = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState([]);

  // Лоадер и уведомления
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => { load(); }, [date]);

  const load = async () => {
    setLoading(true);
    try {
      const dashboardData = await getLoadDashboard(date);
      setData(Array.isArray(dashboardData) ? dashboardData : []);
    } catch (e) {
    } finally {
      setLoading(false);
    }

  };

  const getStatusClass = (status) => {
    if (status === 'free') return 'free';
    if (status === 'pending') return 'status-pending';
    if (status === 'confirmed') return 'status-confirmed';
    if (status === 'arrived') return 'status-arrived';
    if (status === 'in_wash') return 'status-inwash';
    if (status === 'completed') return 'status-completed';
    return '';
  };

  return (
      <>
        {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Загрузка данных...</p>
            </div>
        ) : (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div><h5 style={{ margin: 0 }}>Загрузка моек</h5><div className="muted">расписание и занятость</div></div>
                <input type="date" className="form-control" style={{ width: 'auto' }} value={date} onChange={e => setDate(e.target.value)} />
              </div>

              {data.map(carWash => (
                  <div key={carWash.carWashId} className="card mb-4">
                    <div className="card-header"><h6 className="mb-0">{carWash.carWashName}</h6></div>
                    <div className="card-body">
                      <div className="schedule-grid">
                        <div className="schedule-header">
                          <div className="time-slot"></div>
                          {Array.from({ length: 14 }, (_, i) => i + 8).map(hour => <div key={hour} className="time-slot">{hour}:00</div>)}
                        </div>
                        {carWash.schedule.map(bay => (
                            <div key={bay.bayId} className="schedule-row">
                              <div className="bay-name">{bay.bayName}</div>
                              {bay.slots.map((slot, idx) => (
                                  <div key={idx} className={`time-slot ${slot.status === 'busy' ? getStatusClass(slot.status) : 'free'}`} title={slot.status === 'busy' ? 'Занято' : 'Свободно'}>
                                    {slot.status === 'busy' ? '●' : ''}
                                  </div>
                              ))}
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
              ))}
              {data.length === 0 && <div className="text-center py-4">Нет данных</div>}
            </div>
        )}

      </>
  );
};

export default LoadDashboard;