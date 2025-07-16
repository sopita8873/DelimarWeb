// src/pages/ProductListPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Alert, Button, Container, Spinner, Modal, Form, Row, Col } from 'react-bootstrap';
import { getProductsByCategory, getCategories, createProduct, updateProduct, deleteProduct } from '../services/api'; // Importa las funciones API

function ProductListPage() {
  const { categoryId } = useParams(); // Obtiene el ID de la categoría de la URL
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    categoria_id: categoryId,
    precio: '',
    unidad: 'unidad',
    imagen: '',
    descripcion: ''
  });

  useEffect(() => {
    // Verificar si hay token de admin
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);

    const fetchProductsAndCategoryName = async () => {
      try {
        // Obtener todas las categorías y el nombre de la categoría actual
        const allCategories = await getCategories();
        setCategories(allCategories);
        const currentCategory = allCategories.find(cat => cat.id === parseInt(categoryId));
        if (currentCategory) {
          setCategoryName(currentCategory.nombre);
        } else {
          setCategoryName('Categoría Desconocida');
        }

        // Obtener los productos de la categoría
        const data = await getProductsByCategory(categoryId);
        setProducts(data);
      } catch (err) {
        setError('No se pudieron cargar los productos o la categoría.');
        console.error('Error al cargar productos o categoría:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategoryName();
  }, [categoryId]); // Dependencia en categoryId para recargar si cambia la categoría en la URL

  const refreshProducts = async () => {
    try {
      const data = await getProductsByCategory(categoryId);
      setProducts(data);
    } catch (err) {
      setError('Error al actualizar productos');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      if (editingProduct) {
        await updateProduct(editingProduct.id, newProduct, selectedImage, token);
      } else {
        await createProduct(newProduct, selectedImage, token);
      }
      resetModal();
      refreshProducts();
    } catch (err) {
      setError(editingProduct ? 'Error al actualizar producto' : 'Error al crear producto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await deleteProduct(productId, token);
      refreshProducts();
    } catch (err) {
      setError('Error al eliminar producto');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setNewProduct({
      nombre: product.nombre,
      categoria_id: product.categoria_id,
      precio: product.precio,
      unidad: product.unidad,
      imagen: product.imagen || '',
      descripcion: product.descripcion || ''
    });
    setSelectedImage(null);
    setImagePreview('');
    setShowProductModal(true);
  };

  const resetModal = () => {
    setEditingProduct(null);
    setNewProduct({
      nombre: '',
      categoria_id: categoryId,
      precio: '',
      unidad: 'unidad',
      imagen: '',
      descripcion: ''
    });
    setSelectedImage(null);
    setImagePreview('');
    setShowProductModal(false);
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
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

return (
    <div className="product-list-page">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button as={Link} to="/" variant="outline-secondary">
            Volver a Categorías
          </Button>
          {isAdmin && (
            <Button 
              variant="success" 
              onClick={() => setShowProductModal(true)}
            >
              + Crear Producto
            </Button>
          )}
        </div>
        
        <h1 className="text-center mb-4">Productos de {categoryName}</h1>
        
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        
        <div className="product-simple-list">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-expandable-item">
                <div className="product-list-row" onClick={() => toggleProductExpansion(product.id)}>
                  <div className="product-info">
                    <div className="product-name">
                      {product.nombre}
                      <span className={`expand-indicator ${expandedProducts.has(product.id) ? 'expanded' : ''}`}></span>
                    </div>
                  </div>
                  <div className="product-price-action">
                    <div className="product-price-unit">
                      <span className="product-price">{parseFloat(product.precio).toFixed(2)}€</span>
                      <span className="product-unit">/ {product.unidad}</span>
                    </div>
                    <div className="product-buttons" onClick={(e) => e.stopPropagation()}>
                      {isAdmin && (
                        <>
                          <Button 
                            variant="outline-warning" 
                            size="sm"
                            onClick={() => openEditModal(product)}
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
                      <Col md={4} lg={3}>                      <div className="product-image-container">
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
                          <h6 className="text-muted mb-2">Información del Producto</h6>                        <div className="product-details-grid">
                          <div className="detail-item">
                            <strong>Categoría:</strong> {categoryName}
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
            ))
          ) : (
            <div className="text-center py-4">
              <Alert variant="info" className="text-center">
                No hay productos disponibles en esta categoría en este momento.
              </Alert>
            </div>
          )}
        </div>
      </Container>

      {/* Modal para crear/editar producto */}
      {isAdmin && (
        <Modal show={showProductModal} onHide={resetModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCreateProduct}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre del producto</Form.Label>
                    <Form.Control
                      type="text"
                      value={newProduct.nombre}
                      onChange={(e) => setNewProduct({...newProduct, nombre: e.target.value})}
                      placeholder="Ej: Salmón Fresco"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select
                      value={newProduct.categoria_id}
                      onChange={(e) => setNewProduct({...newProduct, categoria_id: e.target.value})}
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
              </Row>            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={newProduct.precio}
                    onChange={(e) => setNewProduct({...newProduct, precio: e.target.value})}
                    placeholder="0.00"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Unidad</Form.Label>
                  <Form.Select
                    value={newProduct.unidad}
                    onChange={(e) => setNewProduct({...newProduct, unidad: e.target.value})}
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
                    value={newProduct.imagen}
                    onChange={(e) => setNewProduct({...newProduct, imagen: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Preview de imagen */}
            {(imagePreview || newProduct.imagen) && (
              <Row className="mb-3">
                <Col>
                  <Form.Label>Vista previa de la imagen</Form.Label>
                  <div className="text-center">
                    <img
                      src={imagePreview || newProduct.imagen}
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
                  value={newProduct.descripcion}
                  onChange={(e) => setNewProduct({...newProduct, descripcion: e.target.value})}
                  placeholder="Descripción del producto..."
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={resetModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </div>
  );
}

export default ProductListPage;
