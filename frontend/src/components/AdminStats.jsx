// src/components/AdminStats.jsx
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

function AdminStats({ categories, products }) {
  const totalCategories = categories.length;
  const totalProducts = products.length;
  
  // Calcular estadísticas básicas
  const categoriesWithProducts = categories.filter(cat => 
    products.some(prod => prod.categoria_id === cat.id)
  ).length;
  
  const averageProductsPerCategory = totalCategories > 0 
    ? (totalProducts / totalCategories).toFixed(1) 
    : 0;

  return (
    <Row className="mb-4">
      <Col lg={6} md={6} className="mb-3">
        <Card className="border-0 shadow-sm h-100 text-center bg-light">
          <Card.Body>
            <div className="fs-1 text-muted mb-3">📊</div>
            <h3 className="display-6 fw-bold text-dark">{totalCategories}</h3>
            <p className="text-muted mb-2">Categorías Totales</p>
            <small className="text-secondary">
              {categoriesWithProducts} con productos
            </small>
          </Card.Body>
        </Card>
      </Col>
      
      <Col lg={6} md={6} className="mb-3">
        <Card className="border-0 shadow-sm h-100 text-center bg-light">
          <Card.Body>
            <div className="fs-1 text-muted mb-3">📦</div>
            <h3 className="display-6 fw-bold text-dark">{totalProducts}</h3>
            <p className="text-muted mb-2">Productos Totales</p>
            <small className="text-secondary">
              ~{averageProductsPerCategory} por categoría
            </small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default AdminStats;
