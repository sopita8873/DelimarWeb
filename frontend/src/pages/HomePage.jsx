// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/api'; // Importa la función para obtener categorías
import SearchBar from '../components/SearchBar';

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError('No se pudieron cargar las categorías. Intenta de nuevo más tarde.');
        console.error('Error al cargar categorías:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando categorías...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white">
        <Row className="align-items-center justify-content-center text-center text-lg-start">
          <Col lg={8} xl={6}>
            <h1 className="display-4 fw-bold mb-3 text-white">
              Bienvenido a Delimar
            </h1>
            <p className="lead mb-4">
              Tu proveedor de confianza en productos del mar, carnes premium y productos gourmet. 
              Calidad excepcional para tu mesa.
            </p>
            <div className="d-flex gap-3 flex-wrap justify-content-center justify-content-lg-start">
              <span className="badge bg-light text-dark px-3 py-2 fs-6">
                Productos Frescos
              </span>
              <span className="badge bg-light text-dark px-3 py-2 fs-6">
                Entrega Rápida
              </span>
              <span className="badge bg-light text-dark px-3 py-2 fs-6">
                Calidad Garantizada
              </span>
            </div>
          </Col>
          <Col lg={4} xl={6} className="text-center mt-4 mt-lg-0">
            <div className="hero-icon">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Col>
        </Row>
      </div>

      {/* Contenido principal */}
      <div className="text-center mb-5">
        <h2 className="display-6 fw-bold mb-3">Explora Nuestras Categorías</h2>
        <p className="text-muted fs-5">
          Descubre la variedad de productos que tenemos para ofrecerte
        </p>
        
        {/* Barra de búsqueda en la homepage */}
        <div className="mx-auto mb-4" style={{ maxWidth: '500px' }}>
          <SearchBar placeholder="Buscar productos por nombre..." />
        </div>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} xl={6} className="g-4 justify-content-center">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Col key={category.id} className="d-flex">
              <Card className="h-100 shadow-sm border-0 rounded-3 category-card position-relative overflow-hidden w-100">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-4">
                  <Card.Title className="fw-bold fs-5 mb-3" style={{ color: '#2c3e50' }}>
                    {category.nombre}
                  </Card.Title>
                  <Card.Text className="text-muted mb-4 flex-grow-1">
                    Explora productos de {category.nombre.toLowerCase()}.
                  </Card.Text>
                  <Link 
                    to={`/productos/${category.id}`} 
                    className="btn btn-outline-primary mt-auto px-4"
                  >
                    Ver Productos
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Alert variant="info" className="text-center">
              No hay categorías disponibles en este momento.
            </Alert>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default HomePage;
