// src/services/api.js
import axios from 'axios';

// Define la URL base de tu backend usando variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Funciones para interactuar con las categorías ---

/**
 * Obtiene todas las categorías del backend.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos de categoría.
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/categorias');
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error; // Propaga el error para que el componente que llama pueda manejarlo
  }
};

// --- Funciones para interactuar con los productos ---

/**
 * Obtiene todos los productos del backend.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos de producto.
 */
export const getAllProducts = async () => {
  try {
    const response = await api.get('/productos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    throw error;
  }
};

/**
 * Obtiene productos filtrados por categoryId.
 * @param {number} categoryId El ID de la categoría.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos de producto.
 */
export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/productos?categoria_id=${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener productos para la categoría ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Busca productos por término de búsqueda.
 * @param {string} searchTerm El término de búsqueda.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos de producto.
 */
export const searchProducts = async (searchTerm) => {
  try {
    const response = await api.get(`/productos?search=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    console.error(`Error al buscar productos con término "${searchTerm}":`, error);
    throw error;
  }
};

// --- Funciones de administración ---

/**
 * Inicia sesión como administrador
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} Una promesa que resuelve con el token de autenticación
 */
export const adminLogin = async (username, password) => {
  try {
    const response = await api.post('/admin/login', { username, password });
    return response;
  } catch (error) {
    console.error('Error en login de admin:', error);
    throw error;
  }
};

/**
 * Crea una nueva categoría (requiere autenticación de admin)
 * @param {string} nombre - Nombre de la categoría
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Una promesa que resuelve con la categoría creada
 */
export const createCategory = async (nombre, token) => {
  try {
    const response = await api.post('/categorias', { nombre }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
};

/**
 * Elimina una categoría (requiere autenticación de admin)
 * @param {number} categoryId - ID de la categoría
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Una promesa que resuelve con la confirmación
 */
export const deleteCategory = async (categoryId, token) => {
  try {
    const response = await api.delete(`/categorias/${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    throw error;
  }
};

/**
 * Sube una imagen al servidor (requiere autenticación de admin)
 * @param {File} imageFile - Archivo de imagen a subir
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Una promesa que resuelve con la URL de la imagen
 */
export const uploadImage = async (imageFile, token) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/upload-image', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
};

/**
 * Crea un nuevo producto con imagen (requiere autenticación de admin)
 * @param {Object} productData - Datos del producto
 * @param {File|null} imageFile - Archivo de imagen opcional
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Una promesa que resuelve con el producto creado
 */
export const createProduct = async (productData, imageFile, token) => {
  try {
    const formData = new FormData();
    
    // Agregar todos los campos del producto
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    
    // Agregar imagen si existe
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await api.post('/productos', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

/**
 * Actualiza un producto con imagen (requiere autenticación de admin)
 * @param {number} productId - ID del producto
 * @param {Object} productData - Datos del producto actualizados
 * @param {File|null} imageFile - Archivo de imagen opcional
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Una promesa que resuelve con el producto actualizado
 */
export const updateProduct = async (productId, productData, imageFile, token) => {
  try {
    const formData = new FormData();
    
    // Agregar todos los campos del producto
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    
    // Agregar imagen si existe
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await api.put(`/productos/${productId}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

/**
 * Importa productos desde un archivo CSV (requiere autenticación de admin)
 * @param {File} file - Archivo CSV a importar
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Una promesa que resuelve con el resultado de la importación
 */
export const importProductsFromCSV = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/productos/import-csv', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al importar CSV:', error);
    throw error;
  }
};

/**
 * Exporta todos los productos a un archivo CSV (requiere autenticación de admin)
 * @param {string} token - Token de autenticación
 * @returns {Promise<void>} Descarga el archivo CSV automáticamente
 */
export const exportProductsToCSV = async (token) => {
  try {
    const response = await api.get('/productos/export-csv', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'blob' // Importante para manejar archivos
    });
    
    // Crear URL del blob y descargar
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'productos_delimar.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    throw error;
  }
};

/**
 * Elimina un producto (requiere autenticación de admin)
 * @param {number} productId - ID del producto
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Una promesa que resuelve con la confirmación
 */
export const deleteProduct = async (productId, token) => {
  try {
    const response = await api.delete(`/productos/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

/**
 * Elimina todos los productos (requiere autenticación de admin)
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Una promesa que resuelve con la confirmación y el número de productos eliminados
 */
export const deleteAllProducts = async (token) => {
  try {
    const response = await api.delete('/productos', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar todos los productos:', error);
    throw error;
  }
};

export default api;
