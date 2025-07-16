// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Col, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { getCategories } from '../services/api';
import SearchBar from './SearchBar';

function AppNavbar() {
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error al cargar categorías en navbar:', err);
      }
    };

    fetchCategories();
  }, []);

  const isAdmin = localStorage.getItem('adminToken');

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-white">
          Delimar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`text-white ${location.pathname === "/" ? "active" : ""}`}
            >
              Inicio
            </Nav.Link>
            
            {categories.length > 0 && (
              <NavDropdown title="Categorías" id="categories-dropdown" className="text-white">
                {categories.map(category => (
                  <NavDropdown.Item 
                    key={category.id}
                    as={Link} 
                    to={`/productos/${category.id}`}
                  >
                    {category.nombre}
                  </NavDropdown.Item>
                ))}
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/">
                  Ver todas las categorías
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          {/* Barra de búsqueda en el centro */}
          <div className="mx-3 d-none d-lg-block" style={{ minWidth: '300px', maxWidth: '400px' }}>
            <SearchBar placeholder="Buscar productos..." />
          </div>

          <Nav>
            {isAdmin ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/admin/dashboard"
                  className="text-white"
                >
                  Panel Admin
                </Nav.Link>
                <Nav.Link 
                  onClick={() => {
                    localStorage.removeItem('adminToken');
                    window.location.href = '/';
                  }}
                  className="text-white"
                  style={{ cursor: 'pointer' }}
                >
                  Cerrar Sesión
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/admin/login" className="text-white">
                Admin
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
        
        {/* Barra de búsqueda móvil */}
        <div className="w-100 mt-2 d-lg-none">
          <SearchBar placeholder="Buscar productos..." />
        </div>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
