// src/pages/AdminLoginPage.jsx
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/api';

function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminLogin(credentials.username, credentials.password);
      // Guardar el token en localStorage
      localStorage.setItem('adminToken', response.data.token);
      // Redirigir al dashboard de admin
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
      console.error('Error en login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <h3>Acceso Administrativo</h3>
          </Card.Title>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                placeholder="Ingresa tu usuario"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Ingresa tu contraseña"
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminLoginPage;
