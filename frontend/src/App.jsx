import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppNavbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import SearchResultsPage from './pages/SearchResultsPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import NotFoundPage from './pages/NotFoundPage'
import { Container } from 'react-bootstrap'

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
        <Container fluid className="mt-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos/:categoryId" element={<ProductListPage />} />
            <Route path="/producto/:productId" element={<ProductDetailPage />} />
            <Route path="/buscar" element={<SearchResultsPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Container>
        <Footer />
      </div>
    </Router>
  )
}

export default App
