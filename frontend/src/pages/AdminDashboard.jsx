// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCategories, getAllProducts, createCategory, createProduct, deleteCategory, deleteProduct, deleteAllProducts, importProductsFromCSV, exportProductsToCSV } from '../services/api';
import AdminStats from '../components/AdminStats';

function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    categoria_id: '',
    precio: '',
    unidad: 'unidad',
    imagen: '',
    descripcion: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay token de admin
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getAllProducts()
      ]);
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const token = localStorage.getItem('adminToken');
      await createCategory(newCategory, token);
      setNewCategory('');
      setShowCategoryModal(false);
      fetchData();
    } catch (err) {
      setError('Error al crear categoría');
      console.error('Error:', err);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      await createProduct(newProduct, selectedImage, token);
      setNewProduct({
        nombre: '',
        categoria_id: '',
        precio: '',
        unidad: 'unidad',
        imagen: '',
        descripcion: ''
      });
      setSelectedImage(null);
      setImagePreview('');
      setShowProductModal(false);
      fetchData();
    } catch (err) {
      setError('Error al crear producto');
      console.error('Error:', err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await deleteCategory(categoryId, token);
      fetchData();
    } catch (err) {
      setError('Error al eliminar categoría');
      console.error('Error:', err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await deleteProduct(productId, token);
      fetchData();
    } catch (err) {
      setError('Error al eliminar producto');
      console.error('Error:', err);
    }
  };

  const handleDeleteAllProducts = async () => {
    const confirmMessage = `¿Estás COMPLETAMENTE seguro de eliminar TODOS los ${products.length} productos?\n\nEsta acción NO se puede deshacer.\n\nEscribe "BORRAR TODO" para confirmar.`;
    
    const userInput = window.prompt(confirmMessage);
    if (userInput !== 'BORRAR TODO') {
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const result = await deleteAllProducts(token);
      setSuccess(`Se han eliminado ${result.count} productos exitosamente`);
      fetchData();
    } catch (err) {
      setError('Error al eliminar todos los productos');
      console.error('Error:', err);
    }
  };

  const handleCSVImport = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setError('Por favor selecciona un archivo CSV');
      return;
    }

    setCsvLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const result = await importProductsFromCSV(csvFile, token);
      
      let mensaje = `Importación completada: ${result.insertados} productos importados`;
      
      if (result.totalFilas) {
        mensaje += `\n\nResumen detallado:`;
        mensaje += `\n• Total de filas procesadas: ${result.totalFilas}`;
        mensaje += `\n• Productos insertados: ${result.insertados}`;
        
        if (result.duplicados > 0) {
          mensaje += `\n• Productos duplicados omitidos: ${result.duplicados}`;
        }
        
        if (result.categoriasFaltantes > 0) {
          mensaje += `\n• Productos con categorías no encontradas: ${result.categoriasFaltantes}`;
        }
        
        if (result.datosInvalidos > 0) {
          mensaje += `\n• Productos con datos faltantes: ${result.datosInvalidos}`;
        }
        
        if (result.errores > 0) {
          mensaje += `\n• Errores durante la inserción: ${result.errores}`;
        }
      }
      
      setSuccess(mensaje);
      setCsvFile(null);
      setShowCSVModal(false);
      fetchData(); // Refresh data
    } catch (err) {
      setError('Error al importar CSV: ' + (err.response?.data?.error || err.message));
    } finally {
      setCsvLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setError('');
    } else {
      setError('Por favor selecciona un archivo CSV válido');
      setCsvFile(null);
    }
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

  const handleExportCSV = async () => {
    setExportLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      await exportProductsToCSV(token);
      setSuccess('CSV exportado exitosamente');
    } catch (err) {
      setError('Error al exportar CSV: ' + (err.response?.data?.error || err.message));
    } finally {
      setExportLoading(false);
    }
  };

  const resetProductModal = () => {
    setNewProduct({
      nombre: '',
      categoria_id: '',
      precio: '',
      unidad: 'unidad',
      imagen: '',
      descripcion: ''
    });
    setSelectedImage(null);
    setImagePreview('');
    setShowProductModal(false);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando panel de administración...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 admin-dashboard">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Panel de Administración</h1>
            <Button variant="outline-danger" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {/* Estadísticas */}
      <AdminStats categories={categories} products={products} />

      <Row className="mb-4">
        <Col xl={5} lg={6} md={12}>
          <Card className="admin-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Categorías <Badge bg="secondary">{categories.length}</Badge></h2>
              <Button variant="outline-dark" onClick={() => setShowCategoryModal(true)}>
                + Nueva Categoría
              </Button>
            </div>
            {categories.length > 0 ? (
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Productos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.nombre}</td>
                      <td>
                        <Badge bg="light" text="dark">
                          {products.filter(p => p.categoria_id === category.id).length}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="info">No hay categorías creadas</Alert>
            )}
          </Card>
        </Col>

        <Col xl={7} lg={6} md={12}>
          <Card className="admin-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Productos <Badge bg="secondary">{products.length}</Badge></h2>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowCSVModal(true)}
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-upload me-2"></i> Importar CSV
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={handleExportCSV}
                  disabled={exportLoading}
                  className="d-flex align-items-center"
                >
                  {exportLoading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Exportando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-download me-2"></i> Exportar CSV
                    </>
                  )}
                </Button>
                <Button variant="outline-dark" onClick={() => setShowProductModal(true)}>
                  + Nuevo Producto
                </Button>
                {products.length > 0 && (
                  <Button 
                    variant="outline-danger" 
                    onClick={handleDeleteAllProducts}
                    className="d-flex align-items-center"
                  >
                    <i className="bi bi-trash me-2"></i> Borrar Todo
                  </Button>
                )}
              </div>
            </div>
            {products.length > 0 ? (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => {
                      const category = categories.find(c => c.id === product.categoria_id);
                      return (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>{product.nombre}</td>
                          <td>
                            <Badge bg="light" text="dark">
                              {category ? category.nombre : 'Sin categoría'}
                            </Badge>
                          </td>
                          <td>{parseFloat(product.precio || 0).toFixed(2)}€</td>
                          <td>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Alert variant="info">No hay productos creados</Alert>
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal para crear categoría */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Categoría</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateCategory}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Nombre de la categoría</Form.Label>
              <Form.Control
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ej: Pescados Frescos"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowCategoryModal(false)}>
              Cancelar
            </Button>
            <Button variant="outline-dark" type="submit">
              Crear Categoría
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal para crear producto con subida de imágenes */}
      <Modal show={showProductModal} onHide={resetProductModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Producto</Modal.Title>
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
            </Row>
            <Row>
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
            <Button variant="outline-secondary" onClick={resetProductModal}>
              Cancelar
            </Button>
            <Button variant="outline-dark" type="submit">
              Crear Producto
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal para importar CSV */}
      <Modal show={showCSVModal} onHide={() => setShowCSVModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Importar Productos desde CSV</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCSVImport}>
          <Modal.Body>
            <Alert variant="info">
              <strong>Formato del archivo CSV:</strong>
              <br />
              El archivo debe contener las siguientes columnas: <code>nombre, categoria, precio, unidad, imagen, descripcion</code>
              <br />
              <strong>Nota:</strong> La categoría debe existir previamente en el sistema.
            </Alert>
            
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar archivo CSV</Form.Label>
              <Form.Control
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                required
              />
              {csvFile && (
                <Form.Text className="text-success">
                  Archivo seleccionado: {csvFile.name}
                </Form.Text>
              )}
            </Form.Group>

            <Alert variant="warning">
              <strong>Importante:</strong>
              <ul className="mb-0 mt-2">
                <li>Asegúrate de que todas las categorías mencionadas en el CSV ya existen</li>
                <li>Los productos duplicados serán omitidos</li>
                <li>Campos obligatorios: nombre, categoria, precio, unidad</li>
                <li>Campos opcionales: imagen, descripcion</li>
              </ul>
            </Alert>

            <details className="mt-3">
              <summary className="mb-2" style={{cursor: 'pointer'}}>
                <strong>Ver ejemplo de CSV</strong>
              </summary>
              <pre className="bg-light p-3 rounded" style={{fontSize: '0.85rem'}}>
{`nombre,categoria,precio,unidad,imagen,descripcion
Salmón Fresco,Pescados,25.50,kilo,https://ejemplo.com/salmon.jpg,Salmón fresco del día
Atún Rojo,Pescados,30.00,kilo,,Atún rojo de alta calidad
Merluza,Pescados,18.75,kilo,https://ejemplo.com/merluza.jpg,Merluza fresca`}
              </pre>
            </details>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowCSVModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="outline-dark" 
              type="submit" 
              disabled={csvLoading || !csvFile}
            >
              {csvLoading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Importando...
                </>
              ) : (
                'Importar CSV'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default AdminDashboard;
