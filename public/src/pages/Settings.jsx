import React from 'react';
import { ListGroup, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    return (
        <Container className="py-4">
            <h2>Настройки</h2>
            <ListGroup>
                <ListGroup.Item action onClick={() => navigate('/settings/widgets')}>
                    Виджет заявок
                </ListGroup.Item>
                {/* здесь будут другие пункты */}
            </ListGroup>
        </Container>
    );
};

export default Settings;