import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password, name);
      navigate('/');
    } catch (err) {
      setError('Ошибка регистрации. Возможно, email уже используется.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url("https://i.pinimg.com/originals/cc/69/7b/cc697b9810e722e46abb1059ffae0a7d.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <style>
        {`
          .dark-input::placeholder {
            color: #a0aec0 !important;
            opacity: 1 !important;
          }
          .dark-input {
            color: white !important;
          }
        `}
      </style>
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%)'
      }}></div>
      
      <Container style={{ position: 'relative', zIndex: 2, maxWidth: '450px' }}>
        <Card style={{
          background: 'rgba(15, 25, 35, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '28px',
          padding: '1.5rem',
          boxShadow: '0 25px 45px rgba(0,0,0,0.4)',
          color: '#ffffff'
        }}>
          <Card.Body>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🧼</div>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.25rem'
              }}>WashCRM</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Регистрация</p>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: '#e2e8f0' }}>Имя</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="dark-input"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px'
                  }}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label style={{ color: '#e2e8f0' }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@mail.ru"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="dark-input"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px'
                  }}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#e2e8f0' }}>Пароль</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="dark-input"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px'
                  }}
                  required
                />
              </Form.Group>
              
              <Button 
                type="submit" 
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  border: 'none',
                  padding: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '40px',
                  transition: 'all 0.2s'
                }}
              >
                Зарегистрироваться
              </Button>
            </Form>
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8' }}>
              Уже есть аккаунт? <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>Войдите</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Register;