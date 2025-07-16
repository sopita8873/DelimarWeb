# Delimar Web - Sistema de Gestión de Productos 🐟

Una aplicación web completa para la gestión y visualización de productos de una empresa de distribución de alimentos, especializada en productos del mar, carnes y productos gourmet.

## 🚀 Características Principales

### Frontend (React + Vite)
- **Interfaz moderna y responsive** con Bootstrap 5
- **Navegación por categorías** de productos
- **Sistema de búsqueda** en tiempo real
- **Páginas de detalle** de productos individuales
- **Panel de administración** completo
- **Diseño adaptativo** para móviles y desktop

### Backend (Express.js + MySQL)
- **API RESTful** completa
- **Autenticación JWT** para administradores
- **Base de datos MySQL** bien estructurada
- **Endpoints optimizados** con filtros y búsqueda
- **Importación de productos** desde CSV
- **Gestión de categorías y productos**

## 📁 Estructura del Proyecto

```
DelimarWeb/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── Navbar.jsx    # Navegación principal
│   │   │   ├── SearchBar.jsx # Barra de búsqueda
│   │   │   └── AdminStats.jsx # Estadísticas del admin
│   │   ├── pages/           # Páginas principales
│   │   │   ├── HomePage.jsx # Página de inicio
│   │   │   ├── ProductListPage.jsx # Lista de productos
│   │   │   ├── ProductDetailPage.jsx # Detalle de producto
│   │   │   ├── SearchResultsPage.jsx # Resultados de búsqueda
│   │   │   ├── AdminLoginPage.jsx # Login administrativo
│   │   │   ├── AdminDashboard.jsx # Panel de control
│   │   │   └── NotFoundPage.jsx # Página 404
│   │   ├── services/        # Servicios API
│   │   │   └── api.js       # Configuración de Axios
│   │   ├── App.jsx          # Componente principal
│   │   └── App.css          # Estilos personalizados
└── backend/                 # Servidor Express
    ├── src/
    │   └── app.js           # Servidor principal
    ├── scripts/             # Scripts de utilidad
    │   ├── setup-database.js
    │   └── populate-database.js
    └── delimar_database.sql # Esquema de base de datos
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- MySQL Server
- Git

### 1. Clonar el repositorio
```bash
git clone [URL-del-repositorio]
cd DelimarWeb
```

### 2. Configurar la base de datos
1. Instalar y ejecutar MySQL Server
2. Ejecutar el script SQL:
```bash
mysql -u root -p < backend/delimar_database.sql
```

### 3. Configurar el Backend
```bash
cd backend
npm install
npm start
```
El servidor se ejecutará en `http://localhost:3001`

### 4. Configurar el Frontend
```bash
cd frontend
npm install
npm run dev
```
La aplicación se ejecutará en `http://localhost:5173`

## 🔐 Credenciales de Administrador

- **Usuario:** admin
- **Contraseña:** admin123

## 📊 Funcionalidades Detalladas

### Para Usuarios Públicos
- ✅ **Navegación por categorías:** Explora productos organizados por tipo
- ✅ **Búsqueda inteligente:** Encuentra productos por nombre o descripción
- ✅ **Detalles completos:** Información detallada de cada producto
- ✅ **Diseño responsive:** Funciona perfectamente en móviles y desktop
- ✅ **Interfaz intuitiva:** Navegación clara y fácil de usar

### Para Administradores
- ✅ **Dashboard completo** con estadísticas en tiempo real
- ✅ **Gestión de categorías:** Crear, editar y eliminar categorías
- ✅ **Gestión de productos:** CRUD completo de productos
- ✅ **Importación CSV:** Carga masiva de productos desde archivos
- ✅ **Autenticación segura:** Sistema de login con JWT
- ✅ **Estadísticas visuales:** Métricas importantes del inventario

## 🎨 Tecnologías Utilizadas

### Frontend
- **React 19** - Framework de interfaz de usuario
- **Vite** - Herramienta de construcción y desarrollo
- **React Router** - Navegación SPA
- **Bootstrap 5** - Framework CSS
- **React Bootstrap** - Componentes React + Bootstrap
- **Axios** - Cliente HTTP

### Backend
- **Express.js** - Framework web de Node.js
- **MySQL2** - Driver de base de datos
- **JWT** - Autenticación y autorización
- **Multer** - Manejo de archivos
- **CSV-Parser** - Procesamiento de archivos CSV
- **CORS** - Política de origen cruzado

### Base de Datos
- **MySQL** - Sistema de gestión de base de datos relacional

## 🔄 Scripts Disponibles

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run preview      # Vista previa de producción
npm run lint         # Linter ESLint
```

### Backend
```bash
npm start                           # Iniciar servidor
node scripts/setup-database.js     # Configurar base de datos
node scripts/populate-database.js  # Llenar con datos de ejemplo
```

## 🌟 Próximas Características

-  **Notificaciones por email**
- 📱 **Aplicación móvil nativa**
- 🔔 **Sistema de alertas de stock**
- 📈 **Análisis avanzado de ventas**
- 🎯 **Sistema de recomendaciones**
- 💳 **Integración de pagos**

## 📝 API Endpoints

### Públicos
- `GET /categorias` - Obtener todas las categorías
- `GET /productos` - Obtener productos (con filtros opcionales)
- `GET /productos?categoria_id=1` - Productos por categoría
- `GET /productos?search=salmon` - Búsqueda de productos

### Administrativos (Requieren autenticación)
- `POST /admin/login` - Iniciar sesión
- `POST /categorias` - Crear categoría
- `PUT /categorias/:id` - Actualizar categoría
- `DELETE /categorias/:id` - Eliminar categoría
- `POST /productos` - Crear producto
- `PUT /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto
- `POST /productos/import-csv` - Importar productos desde CSV

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**Delimar** - Distribución de productos del mar y gourmet

---

*Desarrollado con ❤️ para la gestión eficiente de inventarios y catálogos de productos.*+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
