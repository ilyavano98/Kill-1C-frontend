import React from "react";

export function ActiveClients() {
    return (
        <>
            <div className="card" style={{ marginTop: '18px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        marginBottom: '12px'
                    }}>
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                    }}>
                        <h5 style={{ margin: 0 }}>Графики — активность</h5>
                        <div className="muted">динамика за 7 дней</div>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center'
                    }}>
                        <button className="btn btn-sm btn-outline-secondary" id="exportCsvBtn"><i
                            className="bi bi-download"></i> Экспорт
                        </button>
                    </div>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 380px',
                    gap: '16px',
                    alignItems: 'center'
                }}>
                    <div className="card" style={{ padding: '10px' }}>
                        <div className="chart-wrap">
                            <canvas id="chartDaily" style={{ width: '100%' }}></canvas>
                        </div>
                    </div>
                    <div className="card" style={{ padding: '10px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div><strong>Топ услуг</strong>
                                <div className="muted">по числу записей</div>
                            </div>
                            <div><i className="bi bi-pie-chart-fill"
                                    style={{
                                        fontSize: '1.4rem',
                                        color: 'var(--accent)'
                                    }}></i></div>
                        </div>
                        <div
                            style={{
                                height: '220px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '8px'
                            }}>
                            <canvas id="chartTop" style={{ maxWidth: '260px' }}></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}