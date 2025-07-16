// src/pages/SearchResultsPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Alert, Button, Spinner, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import { getAllProducts, getCategories, searchProducts, deleteProduct, updateProduct } from '../services/api';
import SearchBar from '../components/SearchBar';

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingProduct, setEditingProduct] = useState({
    id: '',
    nombre: '',
    categoria_id: '',
    precio: '',
    unidad: 'unidad',
    imagen: '',
    descripcion: ''
  });
  
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    // Verificar si hay token de admin
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);
    if (searchQuery) {
      const fetchSearchResults = async () => {
        setLoading(true);
        try {
          const [searchResults, categoriesData] = await Promise.all([
            searchProducts(searchQuery),
            getCategories()
          ]);
          setFilteredProducts(searchResults);
          setCategories(categoriesData);
        } catch (err) {
          setError('Error al buscar productos');
          console.error('Error:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSearchResults();
    } else {
      setFilteredProducts([]);
      setLoading(false);
    }
  }, [searchQuery]);

  const handleNewSearch = (newQuery) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.nombre : 'Sin categoría';
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await deleteProduct(productId, token);
      // Refresh search results
      if (searchQuery) {
        const searchResults = await searchProducts(searchQuery);
        setFilteredProducts(searchResults);
      }
    } catch (err) {
      setError('Error al eliminar producto');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      id: product.id,
      nombre: product.nombre,
      categoria_id: product.categoria_id,
      precio: product.precio,
      unidad: product.unidad,
      imagen: product.imagen || '',
      descripcion: product.descripcion || ''
    });
    setSelectedImage(null);
    setImagePreview('');
    setShowEditModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        // Crear preview de la imagen
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
        setError('');
      } else {
        setError('Por favor selecciona un archivo de imagen válido');
        setSelectedImage(null);
        setImagePreview('');
      }
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const { id, ...productData } = editingProduct;
      await updateProduct(id, productData, selectedImage, token);
      setShowEditModal(false);
      setSelectedImage(null);
      setImagePreview('');
      setError('');
      
      // Refresh search results
      if (searchQuery) {
        const searchResults = await searchProducts(searchQuery);
        setFilteredProducts(searchResults);
      }
    } catch (err) {
      setError('Error al actualizar producto');
    }
  };

  const toggleProductExpansion = (productId) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Buscando productos...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Buscar Productos</h1>
          <SearchBar 
            onSearch={handleNewSearch}
            placeholder="Buscar productos por nombre o descripción..."
            className="mb-4"
          />
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {searchQuery && (
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h3>
                Resultados para: "{searchQuery}"
                <Badge bg="primary" className="ms-2">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                </Badge>
              </h3>
              <Button as={Link} to="/" variant="outline-secondary" size="sm">
                Volver al inicio
              </Button>
            </div>
          </Col>
        </Row>
      )}

      {searchQuery && filteredProducts.length === 0 && !loading && (
        <Alert variant="info" className="text-center">
          <Alert.Heading>No se encontraron productos</Alert.Heading>
          <p>
            No hay productos que coincidan con tu búsqueda "{searchQuery}".
            <br />
            Intenta con otros términos o explora nuestras categorías.
          </p>
          <Button as={Link} to="/" variant="outline-primary">
            Ver todas las categorías
          </Button>
        </Alert>
      )}

      {filteredProducts.length > 0 && (
        <div className="product-simple-list">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-expandable-item">
              <div className="product-list-row" onClick={() => toggleProductExpansion(product.id)}>
                <div className="product-info">
                  <div className="product-name">
                    {product.nombre}
                    <span className={`expand-indicator ${expandedProducts.has(product.id) ? 'expanded' : ''}`}></span>
                  </div>
                  <div className="product-category">
                    <Badge bg="secondary">{getCategoryName(product.categoria_id)}</Badge>
                  </div>
                </div>
                <div className="product-price-action">
                  <div className="product-price-unit">
                    <span className="product-price">{parseFloat(product.precio || 0).toFixed(2)}€</span>
                    <span className="product-unit">/ {product.unidad}</span>
                  </div>
                  <div className="product-buttons" onClick={(e) => e.stopPropagation()}>
                    {isAdmin && (
                      <>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="me-2"
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Borrar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {expandedProducts.has(product.id) && (
                <div className="product-details-expanded">
                  <Row className="g-3">
                    <Col md={4} lg={3}>
                      <div className="product-image-container">
                        <img
                          src={product.imagen && product.imagen.startsWith('/uploads/') 
                            ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${product.imagen}`
                            : product.imagen || `https://placehold.co/300x200/2c3e50/ffffff?text=${product.nombre.substring(0, 10)}`
                          }
                          alt={product.nombre}
                          className="product-expanded-image"
                        />
                      </div>
                    </Col>
                    <Col md={8} lg={9}>
                      <div className="product-expanded-info">
                        <h6 className="text-muted mb-2">Información del Producto</h6>
                        <div className="product-details-grid">
                          <div className="detail-item">
                            <strong>Categoría:</strong> {getCategoryName(product.categoria_id)}
                          </div>
                          <div className="detail-item">
                            <strong>Unidad:</strong> {product.unidad}
                          </div>
                        </div>
                        {product.descripcion && (
                          <div className="product-description mt-3">
                            <h6 className="text-muted mb-2">Descripción</h6>
                            <p className="text-muted">{product.descripcion}</p>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!searchQuery && (
        <Alert variant="info" className="text-center">
          <Alert.Heading>¿Qué estás buscando?</Alert.Heading>
          <p>
            Escribe el nombre del producto que deseas encontrar en el campo de búsqueda.
          </p>
        </Alert>
      )}

      {/* Modal para editar producto */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateProduct}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del producto</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingProduct.nombre}
                    onChange={(e) => setEditingProduct({...editingProduct, nombre: e.target.value})}
                    placeholder="Ej: Salmón Fresco"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={editingProduct.categoria_id}
                    onChange={(e) => setEditingProduct({...editingProduct, categoria_id: e.target.value})}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={editingProduct.precio}
                    onChange={(e) => setEditingProduct({...editingProduct, precio: e.target.value})}
                    placeholder="0.00"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Unidad</Form.Label>
                  <Form.Select
                    value={editingProduct.unidad}
                    onChange={(e) => setEditingProduct({...editingProduct, unidad: e.target.value})}
                    required
                  >
                    <option value="unidad">Unidad</option>
                    <option value="kilo">Kilo</option>
                    <option value="caja">Caja</option>
                    <option value="S/M">S/M</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            {/* Sección de imagen mejorada */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subir imagen del producto</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Form.Text className="text-muted">
                    Formatos soportados: JPG, PNG, GIF (máx. 5MB)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>O ingresa URL de imagen</Form.Label>
                  <Form.Control
                    type="url"
                    value={editingProduct.imagen}
                    onChange={(e) => setEditingProduct({...editingProduct, imagen: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Preview de imagen */}
            {(imagePreview || editingProduct.imagen) && (
              <Row className="mb-3">
                <Col>
                  <Form.Label>Vista previa de la imagen</Form.Label>
                  <div className="text-center">
                    <img
                      src={imagePreview || editingProduct.imagen}
                      alt="Vista previa"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '150px',
                        objectFit: 'cover',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </Col>
              </Row>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Descripción (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editingProduct.descripcion}
                onChange={(e) => setEditingProduct({...editingProduct, descripcion: e.target.value})}
                placeholder="Descripción del producto..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default SearchResultsPage;
