# Biblioteca

Proyecto para el sistema de gestión de biblioteca. Incluye la configuración
inicial del backend, entidades TypeORM y login de administrador con bcrypt y
JWT. El frontend React tiene login y rutas privadas; los CRUD todavía están
pendientes de implementación.

## Requisitos

- Node.js LTS y npm.
- XAMPP con MySQL iniciado.

## Configurar el backend

Desde la raíz del repositorio:

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edita `backend/.env` con la configuración local. En XAMPP, los valores
habituales son `DB_HOST=localhost`, `DB_PORT=3306` y `DB_USER=root`.
`DB_PASSWORD` puede quedar vacío si tu instalación local de MySQL no tiene
contraseña para ese usuario. Crea la base de datos `biblioteca` desde
phpMyAdmin antes de iniciar el servidor.

Configura también `JWT_SECRET` con un secreto aleatorio y cambia
`ADMIN_PASSWORD` por una contraseña segura. El usuario administrador se crea
al iniciar el backend; su contraseña se guarda con bcrypt.

## Ejecutar y compilar

Desde `backend/`:

```powershell
npm run dev
```

Para verificar la sintaxis de los archivos JavaScript:

```powershell
npm run build
```

En desarrollo, TypeORM sincroniza las entidades con la base de datos. No usar
`synchronize` en producción; antes de desplegar, reemplazarlo por migraciones.

El endpoint público de inicio de sesión es `POST /api/auth/login` y recibe:

```json
{
  "username": "admin",
  "password": "la contraseña configurada en ADMIN_PASSWORD"
}
```

Las demás rutas bajo `/api` requieren el encabezado
`Authorization: Bearer <token>`.

## Seguridad y estado del proyecto

No subas `backend/.env`, logs, `node_modules` ni `dist`. El archivo
`backend/.env.example` contiene solamente valores de ejemplo.

## Ejecutar el frontend

En otra terminal, desde la raíz del repositorio:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Abre la URL local que muestra Vite (por defecto `http://localhost:5173`).
`VITE_API_URL` puede cambiarse en `frontend/.env` si el backend usa otro host
o puerto. La pantalla de login conecta con `POST /api/auth/login`, guarda el
JWT en `localStorage` y protege las páginas privadas. Los CRUD del catálogo y
el visor de logs se implementarán al completar sus rutas en el backend.
