// src/components/Footer.jsx
import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-white py-2">
      <Container>
        <div className="text-center">
          <small className="text-white">
            © {new Date().getFullYear()} Delimar. Todos los derechos reservados.
          </small>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
