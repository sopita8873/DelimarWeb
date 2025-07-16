// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function SearchBar({ onSearch, placeholder = "Buscar productos...", className = "" }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm.trim());
      } else {
        // Si no hay función onSearch, navegar a página de resultados
        navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
      }
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={className}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-start"
        />
        {searchTerm && (
          <Button 
            variant="outline-secondary" 
            onClick={handleClear}
            style={{ zIndex: 1 }}
          >
            ✕
          </Button>
        )}
        <Button 
          variant="primary" 
          type="submit"
          disabled={!searchTerm.trim()}
        >
          🔍 Buscar
        </Button>
      </InputGroup>
    </Form>
  );
}

export default SearchBar;
