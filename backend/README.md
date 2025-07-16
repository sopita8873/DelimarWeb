# DelimarWeb Backend

Backend API para la aplicación de gestión de productos pesqueros Delimar.

## 🚀 Deployment en Railway

Este backend está optimizado para deployarse en Railway con una base de datos MySQL.

### Variables de Entorno Requeridas:

```env
NODE_ENV=production
JWT_SECRET=tu_jwt_secret_super_seguro
ADMIN_USER=admin
ADMIN_PASS=tu_password_seguro
MYSQL_URL=mysql://user:password@host:port/database
```

### 🛠 Instalación Local

```bash
npm install
npm start
```

### 📋 Endpoints Principales

- `GET /categorias` - Obtener todas las categorías
- `POST /categorias` - Crear nueva categoría (admin)
- `PUT /categorias/:id` - Actualizar categoría (admin)
- `DELETE /categorias/:id` - Eliminar categoría (admin)
- `GET /productos` - Obtener productos (con filtros)
- `POST /productos` - Crear nuevo producto (admin)
- `PUT /productos/:id` - Actualizar producto (admin)
- `DELETE /productos/:id` - Eliminar producto (admin)
- `DELETE /productos` - Eliminar todos los productos (admin)
- `POST /admin/login` - Login de administrador
- `POST /productos/import-csv` - Importar productos desde CSV (admin)
- `GET /productos/export-csv` - Exportar productos a CSV (admin)

### 🔒 Autenticación

El sistema usa variables de entorno para la autenticación de administradores:
- `ADMIN_USER`: Nombre de usuario del administrador
- `ADMIN_PASS`: Contraseña del administrador

Las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

### 📊 Base de Datos

El sistema solo requiere 2 tablas:
- `categorias` - Categorías de productos
- `productos` - Productos con sus detalles

No hay tabla de usuarios ya que la autenticación se maneja con variables de entorno.
