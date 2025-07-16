# 🔧 SOLUCIÓN DEFINITIVA - Error 403 GitHub

## 🚨 **Problema:**
Git está usando credenciales cacheadas del usuario `sopa8873` en lugar de `sopita8873`.

## ✅ **SOLUCIÓN PASO A PASO:**

### **Método 1: Limpiar Credenciales (RECOMENDADO)**

```bash
# 1. Limpiar credenciales Git
git config --global --unset credential.helper
git config --unset credential.helper

# 2. Eliminar credenciales de Windows
cmdkey /delete:target=git:https://github.com

# 3. Configurar usuario correcto
git config user.name "sopita8873"
git config user.email "david.r.r.25.05@gmail.com"

# 4. Configurar credential helper
git config credential.helper manager-core

# 5. Push (te pedirá credenciales nuevas)
git push -u origin main
```

**Cuando aparezca el login:**
- Usuario: `sopita8873`
- Contraseña: tu contraseña de GitHub

---

### **Método 2: Personal Access Token (MÁS SEGURO)**

1. **Crear token:**
   - Ve a: https://github.com/settings/tokens
   - "Generate new token (classic)"
   - Nombre: `DelimarWeb Deploy`
   - Scope: ✅ `repo` (all repository permissions)
   - Generate token
   - **COPIA EL TOKEN** (ej: `ghp_xxxxxxxxxxxxxxxxxxxx`)

2. **Usar token:**
   ```bash
   git push -u origin main
   ```
   - Usuario: `sopita8873`
   - Contraseña: **[pega aquí tu token]**

---

### **Método 3: Cambiar a tu cuenta actual (FÁCIL)**

```bash
# Cambiar URL al usuario autenticado
git remote set-url origin https://github.com/sopa8873/DelimarWeb.git

# Push directo
git push -u origin main
```

**Nota:** Necesitas crear repo "DelimarWeb" en la cuenta `sopa8873`

---

### **Método 4: GitHub Desktop (VISUAL)**

1. **Descargar:** https://desktop.github.com
2. **Login** con cuenta `sopita8873`
3. **File → Add Local Repository**
4. **Seleccionar:** `c:\Users\david\Documents\Javi\DelimarWeb`
5. **Publish repository**

---

## 🎯 **MI RECOMENDACIÓN:**

**Usa el Método 2 (Personal Access Token)**:
1. Es más seguro
2. No tienes problemas de credenciales
3. Funciona siempre

Una vez que el código esté en GitHub, el deployment será súper fácil en Vercel y Railway.

---

## 🚀 **Después de solucionar GitHub:**

### **Deploy será automático:**
- **Vercel:** Import GitHub repo → Root: `frontend`
- **Railway:** Deploy from GitHub → Root: `backend` + MySQL

**¿Necesitas que te guíe con el Personal Access Token?**
