# 🔧 Variables de Entorno para Deployment

## Frontend (.env.production)
```env
VITE_API_URL=https://delimarweb-backend.railway.app
```

## Backend (Railway Environment Variables)
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=tu_jwt_secreto_super_seguro_aqui
ADMIN_USER=admin
ADMIN_PASS=tu_password_admin_seguro

# Base de datos (Railway MySQL genera automáticamente)
MYSQL_URL=mysql://username:password@host:port/database
# O manualmente:
DB_HOST=containers-us-west-x.railway.app
DB_USER=root
DB_PASSWORD=password_generado
DB_NAME=railway
```

## ⚠️ IMPORTANTE:
- Cambia JWT_SECRET por algo seguro
- Cambia ADMIN_PASS por una contraseña segura
- Railway genera MYSQL_URL automáticamente al añadir MySQL

## 📋 Configuración en Railway:
1. Ve a tu proyecto en Railway
2. Variables tab
3. Añade cada variable una por una
4. Deploy automáticamente se ejecutará
