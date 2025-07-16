# 🚀 DEPLOYMENT RÁPIDO - DelimarWeb

## ⚡ MÉTODO MÁS RÁPIDO (5 minutos):

### **Paso 1: Preparar archivos**
```bash
# Ya tienes todo listo ✅
```

### **Paso 2: Subir a GitHub**
1. Ve a [github.com](https://github.com) → "New repository"
2. Nombre: `delimarweb`
3. ✅ Public
4. Crear repositorio

### **Paso 3: Comandos para subir**
```bash
cd "c:\Users\david\Documents\Javi\DelimarWeb"
git init
git add .
git commit -m "DelimarWeb - Aplicación completa"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/delimarweb.git
git push -u origin main
```

### **Paso 4: Deploy Frontend (2 min)**
1. [vercel.com](https://vercel.com) → Sign up con GitHub
2. "Import Project" → Selecciona `delimarweb`
3. **Root Directory**: `frontend`
4. Deploy

### **Paso 5: Deploy Backend (2 min)**
1. [railway.app](https://railway.app) → Sign up con GitHub
2. "New Project" → "Deploy from GitHub"
3. Selecciona `delimarweb`
4. **Root Directory**: `backend`
5. Deploy

### **Paso 6: Base de Datos (1 min)**
En Railway:
1. Add → Database → MySQL
2. Variables se generan automáticamente
3. Importar `delimar_database.sql`

## 🎯 **URLs Finales:**
- **Web**: `https://delimarweb-xxx.vercel.app`
- **Admin**: `https://delimarweb-xxx.vercel.app/admin`
- **API**: `https://delimarweb-xxx.railway.app`

## 💡 **¿Necesitas ayuda?**
Te puedo ayudar paso a paso con cada parte.
