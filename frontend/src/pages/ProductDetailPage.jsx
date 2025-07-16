// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { getAllProducts, getCategories } from '../services/api';

function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getCategories()
        ]);

        const foundProduct = productsData.find(p => p.id === parseInt(productId));
        if (foundProduct) {
          setProduct(foundProduct);
          const foundCategory = categoriesData.find(c => c.id === foundProduct.categoria_id);
          setCategory(foundCategory);
        } else {
          setError('Producto no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el producto');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleGoBack = () => {
    if (category) {
      navigate(`/productos/${category.id}`);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando producto...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <Alert variant="danger" className="text-center">
          {error || 'Producto no encontrado'}
        </Alert>
        <div className="text-center">
          <Button as={Link} to="/" variant="primary">
            Volver al Inicio
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Button variant="outline-secondary" onClick={handleGoBack} className="mb-4">
        Volver a {category ? category.nombre : 'Categorías'}
      </Button>

      <Row className="justify-content-center">
        <Col lg={5} xl={4} className="mb-4 d-flex justify-content-center">
          <Card className="border-0 shadow">
            <Card.Img
              variant="top"
              src={product.imagen || `https://placehold.co/600x400/007bff/ffffff?text=${product.nombre.substring(0, 10)}`}
              alt={product.nombre}
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </Card>
        </Col>
        
        <Col lg={7} xl={8}>
          <div className="product-details text-center text-lg-start">
            <h1 className="display-5 fw-bold mb-3">{product.nombre}</h1>
            
            {category && (
              <div className="mb-3">
                <Badge bg="primary" className="fs-6 px-3 py-2">
                  {category.nombre}
                </Badge>
              </div>
            )}

            <div className="price-section mb-4">
              <h2 className="text-success fw-bold">
                {parseFloat(product.precio || 0).toFixed(2)}€
                <small className="text-muted fs-5 ms-2">por {product.unidad}</small>
              </h2>
            </div>

            {product.descripcion && (
              <div className="description-section mb-4">
                <h5>Descripción</h5>
                <p className="text-muted">{product.descripcion}</p>
              </div>
            )}

            <div className="product-info mb-4">
              <h5>Información del Producto</h5>
              <Row>
                <Col md={6}>
                  <p><strong>Unidad de venta:</strong> {product.unidad}</p>
                </Col>
                <Col md={6}>
                  <p><strong>ID del producto:</strong> #{product.id}</p>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Sección de productos relacionados (futura) */}
      <Row className="mt-5">
        <Col className="text-center">
          <h4>¿Te interesa explorar más productos?</h4>
          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <Button 
              as={Link} 
              to="/" 
              variant="outline-primary"
            >
              Ver todas las categorías
            </Button>
            {category && (
              <Button 
                as={Link} 
                to={`/productos/${category.id}`}
                variant="outline-secondary"
              >
                Más productos de {category.nombre}
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetailPage;
