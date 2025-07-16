// src/pages/NotFoundPage.jsx
import React from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <Row>
        <Col className="text-center">
          <div className="mb-4">
            <h1 className="display-1 text-muted">404</h1>
            <h2 className="mb-3">Página no encontrada</h2>
          </div>
          
          <Alert variant="info" className="mb-4">
            <Alert.Heading>¡Oops! Parece que te has perdido</Alert.Heading>
            <p>La página que estás buscando no existe o ha sido movida.</p>
          </Alert>

          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <Button as={Link} to="/" variant="primary" size="lg">
              🏠 Ir al Inicio
            </Button>
            <Button 
              variant="outline-secondary" 
              size="lg"
              onClick={() => window.history.back()}
            >
              ← Volver Atrás
            </Button>
          </div>

          <div className="mt-5">
            <h5>¿Necesitas ayuda?</h5>
            <p className="text-muted">
              Explora nuestras categorías de productos desde la página principal
              o contacta con nuestro equipo si necesitas asistencia.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFoundPage;
