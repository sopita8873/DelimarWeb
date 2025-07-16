# Guía de Deployment - DelimarWeb

## 🎯 Opción Recomendada: Vercel + Railway (GRATIS)

### 1. Preparar Frontend para Vercel

```bash
cd frontend
npm install
npm run build
```

### 2. Configurar variables de entorno del frontend

Crea `.env.production` en la carpeta frontend:
```env
VITE_API_URL=https://tu-backend.railway.app
```

### 3. Subir a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tuusuario/delimarweb.git
git push -u origin main
```

### 4. Deployar Frontend en Vercel
1. Ve a https://vercel.com
2. Conecta tu GitHub
3. Importa el repositorio
4. Configura:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 5. Deployar Backend en Railway
1. Ve a https://railway.app
2. "New Project" > "Deploy from GitHub repo"
3. Selecciona tu repositorio
4. Configura Root Directory: `backend`
5. Añade variables de entorno:
   ```
   NODE_ENV=production
   JWT_SECRET=tu_jwt_secret_super_seguro
   ADMIN_USER=admin
   ADMIN_PASS=tu_password_seguro
   ```

### 6. Configurar Base de Datos en Railway
1. En tu proyecto Railway, añade "MySQL Plugin"
2. Railway te dará las credenciales automáticamente (MYSQL_URL)
3. Importa la estructura de base de datos usando `delimar_database.sql`

## 🔒 URLs Finales
- **Frontend**: https://delimarweb.vercel.app
- **Backend**: https://delimarweb-backend.railway.app  
- **Admin**: https://delimarweb.vercel.app/admin/login

## 💰 Costos
- **Vercel**: Gratis (hasta 100GB bandwidth)
- **Railway**: Gratis ($5 en créditos mensuales)
- **Total**: €0/mes para empezar

## 🚀 Alternativas de Pago (Más Profesionales)
- **DigitalOcean App Platform**: $5/mes
- **AWS Amplify + RDS**: ~$10/mes
- **VPS DigitalOcean**: $5/mes (control total)
