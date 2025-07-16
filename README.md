# DelimarWeb

Aplicación web para gestión de productos pesqueros de la empresa Delimar.

## 🚀 Demo en Vivo

- **Aplicación**: https://delimarweb.vercel.app
- **Panel Admin**: https://delimarweb.vercel.app/admin/login (admin/admin123)

## 📋 Características

- ✅ Catálogo de productos por categorías
- ✅ Búsqueda de productos
- ✅ Panel de administración completo
- ✅ Importación/Exportación CSV
- ✅ Interfaz responsive y profesional
- ✅ Autenticación JWT para administradores

## 🛠 Tecnologías

**Frontend:**
- React 19 + Vite
- Bootstrap 5
- Axios

**Backend:**
- Node.js + Express
- MySQL2
- JWT Authentication
- Multer (file uploads)
- CSV Parser

## 📦 Instalación Local

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm start
```

### Base de Datos
```bash
# Importar el archivo delimar_database.sql en MySQL
mysql -u root -p < backend/delimar_database.sql
```

## 🌐 Deployment

Este proyecto está configurado para deployment automático:

- **Frontend**: Vercel
- **Backend**: Railway
- **Base de Datos**: Railway MySQL

Ver `DEPLOYMENT_GUIDE.md` para instrucciones detalladas.

## 👨‍💻 Autor

Desarrollado para **Delimar** - Productos Pesqueros

## 📄 Licencia

MIT License
