# 🔬 SciLens — Explorador de Artículos Científicos de Acceso Abierto

Proyecto Full-Stack diseñado como Trabajo de Fin de Grado (TFG). SciLens permite buscar, explorar y gestionar artículos científicos de acceso abierto consultando dos bases de datos académicas externas (**arXiv** y **CrossRef**) a través de una API REST propia con frontend en React + TypeScript.

---

## ✨ Características Destacadas

- 🔍 **Búsqueda Unificada** en arXiv y CrossRef desde una sola interfaz
- 🎛️ **Filtros Avanzados** por fuente, área temática, rango de años, mínimo de citas y autor
- 📄 **Detalle de Artículo** con abstract completo, modo divulgativo y exportación de citas
- ⚖️ **Comparador** de hasta 3 artículos en tabla lado a lado
- ⭐ **Favoritos** con notas, etiquetas, flag "leer más tarde" y colecciones personalizadas
- 📜 **Historial de Búsquedas** paginado con eliminación individual
- 📊 **Estadísticas Personales** con gráficos por año, área y fuente (Chart.js)
- 🧭 **Exploración por Áreas** en 12 disciplinas científicas
- 🔐 **Autenticación JWT** con roles `usuario` y `admin`
- 👤 **Perfil de Usuario** con avatar, áreas de interés y cambio de contraseña
- 🛡️ **Panel de Administración** con gestión de usuarios y analíticas globales
- 🌙 **Tema Claro/Oscuro** con persistencia
- 🔒 **Seguridad** con bcrypt, helmet, CORS y rate limiting

---

## 🚀 Inicio Rápido

```bash
# Backend (Terminal 1)
cd backend
npm install
npm run seed:admin   # Crear usuario administrador inicial
npm run dev          # http://localhost:3000

# Frontend (Terminal 2)
cd frontend
npm install
npm run dev          # http://localhost:5173
```

---

## 📑 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Páginas del Frontend](#-páginas-del-frontend)
- [Autenticación y Roles](#-autenticación-y-roles)
- [Modelos de Base de Datos](#️-modelos-de-base-de-datos)
- [APIs Externas Consumidas](#-apis-externas-consumidas)
- [Testing con Postman/Thunder Client](#-testing-con-postmanthunder-client)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Autor](#-autor)

---

## 📖 Descripción del Proyecto

**Nombre:** SciLens — Explorador de Artículos Científicos de Acceso Abierto

**Problema a Resolver:** Crear una plataforma que centralice el acceso a publicaciones científicas de múltiples fuentes académicas, eliminando la necesidad de consultar cada base de datos por separado y ofreciendo herramientas personales de organización, comparación y seguimiento de lecturas.

**Descripción Funcional:**
Sistema full-stack que permite a los usuarios:
- ✅ Buscar artículos científicos en arXiv y CrossRef simultáneamente
- ✅ Filtrar resultados por fuente, área temática, año, citas mínimas y autor
- ✅ Ver el detalle completo de cada artículo con abstract y referencias
- ✅ Activar el modo divulgativo para leer un resumen en lenguaje accesible
- ✅ Exportar la cita bibliográfica del artículo
- ✅ Comparar hasta 3 artículos en paralelo
- ✅ Guardar artículos como favoritos con notas, etiquetas y colecciones
- ✅ Marcar artículos para "leer más tarde"
- ✅ Consultar y gestionar el historial de búsquedas
- ✅ Ver estadísticas personales de lectura con gráficos
- ✅ Explorar artículos organizados por 12 áreas científicas
- ✅ Registrarse, iniciar sesión y gestionar el perfil con avatar
- ✅ (Admin) Gestionar usuarios y ver analíticas globales de la plataforma

---

## 🛠️ Tecnologías Utilizadas

### Backend

| Paquete | Versión | Uso |
|---|---|---|
| Node.js + Express | `^5.2.1` | Servidor y framework web |
| MongoDB + Mongoose | `^9.3.0` | Base de datos y ODM |
| jsonwebtoken | `^9.0.3` | Autenticación JWT |
| bcryptjs | `^3.0.3` | Hash de contraseñas |
| helmet | `^8.1.0` | Cabeceras de seguridad HTTP |
| cors | `^2.8.6` | Control de orígenes cruzados |
| express-rate-limit | `^8.3.1` | Limitación de peticiones |
| multer | `^2.1.1` | Subida de avatares |
| axios | `^1.13.6` | Llamadas a APIs externas |
| dotenv | `^17.3.1` | Variables de entorno |
| nodemon (dev) | `^3.1.14` | Recarga automática en desarrollo |
| Jest + supertest (test) | `^30.3.0` / `^7.2.2` | Tests unitarios e integración |

### Frontend

| Paquete | Versión | Uso |
|---|---|---|
| React | `^19.2.4` | Librería de interfaz de usuario |
| TypeScript | `~5.9.3` | Tipado estático |
| Vite | `^8.0.0` | Bundler y servidor de desarrollo |
| react-router-dom | `^7.13.1` | Enrutamiento SPA |
| axios | `^1.13.6` | Peticiones HTTP al backend |
| chart.js + react-chartjs-2 | `^4.5.1` / `^5.3.1` | Gráficos de estadísticas |
| lucide-react | `^0.577.0` | Iconografía |
| Vitest + @testing-library/react | `^4.1.0` / `^16.3.2` | Testing de componentes |

---

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- **MongoDB** (instalación local) o cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** para clonar el repositorio

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/LuissRG18/TFG.git
cd TFG
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crea el fichero `.env` en `backend/` (ver sección [Variables de Entorno](#-variables-de-entorno)):

```bash
npm run dev          # Modo desarrollo con recarga automática
```

El servidor escuchará en `http://localhost:3000` por defecto.

> **Opcional:** crea el usuario administrador inicial con:
> ```bash
> npm run seed:admin
> ```

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

Crea el fichero `.env` en `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

```bash
npm run dev          # Servidor de desarrollo en http://localhost:5173
```

---

## 🌐 URLs de Acceso

### 🔴 Desarrollo Local

| Componente | URL | Puerto |
|---|---|---|
| **Backend API** | http://localhost:3000 | 3000 |
| **Frontend React** | http://localhost:5173 | 5173 |
| **Preview build** | http://localhost:4173 | 4173 |

---

## 🔑 Variables de Entorno

### Backend — `backend/.env`

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/scilens
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173,http://localhost:4173
NODE_ENV=development
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/scilens` |
| `JWT_SECRET` | Clave secreta para firmar los JWT | `una_clave_muy_segura` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `7d` |
| `FRONTEND_URL` | Orígenes permitidos por CORS (separados por coma) | `http://localhost:5173,http://localhost:4173` |
| `NODE_ENV` | Entorno de ejecución | `development` |

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📦 Scripts Disponibles

### Backend (`backend/`)

| Script | Comando | Descripción |
|---|---|---|
| `npm start` | `node src/app.js` | Arranque en producción |
| `npm run dev` | `nodemon src/app.js` | Desarrollo con recarga automática |
| `npm run seed:admin` | `node src/scripts/createAdmin.js` | Crea el usuario administrador inicial |

### Frontend (`frontend/`)

| Script | Comando | Descripción |
|---|---|---|
| `npm run dev` | `vite` | Servidor de desarrollo (puerto 5173) |
| `npm run build` | `tsc -b && vite build` | Comprobación de tipos + build de producción |
| `npm run preview` | `vite preview` | Previsualización del build (puerto 4173) |
| `npm run lint` | `eslint .` | Análisis estático del código |

---

## 📊 Estructura del Proyecto

```
TFG/
├── backend/
│   ├── public/
│   │   └── avatars/              # Imágenes de perfil subidas por usuarios
│   └── src/
│       ├── app.js                # Punto de entrada, middlewares globales
│       ├── config/
│       │   └── db.js             # Conexión a MongoDB
│       ├── controllers/          # Lógica de negocio
│       │   ├── articulosController.js
│       │   ├── authController.js
│       │   ├── favoritosController.js
│       │   └── usuariosController.js
│       ├── middleware/
│       │   └── auth.js           # proteger (JWT) y soloAdmin
│       ├── models/               # Esquemas Mongoose
│       │   ├── User.js
│       │   ├── ArticuloFavorito.js
│       │   └── Busqueda.js
│       ├── routes/               # Definición de rutas Express
│       │   ├── articulosRoutes.js
│       │   ├── authRoutes.js
│       │   ├── favoritosRoutes.js
│       │   └── usuariosRoutes.js
│       └── scripts/
│           └── createAdmin.js    # Seed del admin inicial
└── frontend/
    └── src/
        ├── App.tsx               # Router principal y providers
        ├── components/           # Componentes reutilizables
        │   ├── ArticuloCard.tsx
        │   ├── Footer.tsx
        │   ├── Navbar.tsx
        │   ├── PrivateRoute.tsx
        │   └── SearchBar.tsx
        ├── context/
        │   ├── AuthContext.tsx    # Estado global de autenticación
        │   └── ThemeContext.tsx   # Tema claro/oscuro
        ├── pages/                # Páginas de la aplicación
        ├── services/             # Llamadas a la API del backend
        ├── types/                # Tipos TypeScript compartidos
        └── utils/
            └── exportCitation.ts # Exportación de citas bibliográficas
```

---

## 🔌 Endpoints de la API

**Base URL:** `http://localhost:3000/api`

### Autenticación — `/api/auth`
> ⚠️ Rate limit: 20 peticiones / 15 minutos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/auth/registro` | Público | Registrar nuevo usuario |
| `POST` | `/auth/login` | Público | Iniciar sesión, devuelve JWT |
| `GET` | `/auth/perfil` | Privado | Obtener perfil propio |
| `PUT` | `/auth/perfil` | Privado | Actualizar nombre y áreas de interés |
| `PUT` | `/auth/cambiar-password` | Privado | Cambiar contraseña |
| `POST` | `/auth/avatar` | Privado | Subir imagen de avatar (máx. 2 MB, jpg/png/webp/gif) |

### Artículos — `/api/articulos`
> ⚠️ Rate limit general: 200 peticiones / 15 minutos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/articulos/arxiv/buscar` | Público | Buscar en arXiv (`?q=&area=&pagina=&limite=`) |
| `GET` | `/articulos/arxiv/:id` | Público | Detalle de artículo arXiv |
| `GET` | `/articulos/crossref/buscar` | Público | Buscar en CrossRef (`?q=&autor=&pagina=&limite=`) |
| `GET` | `/articulos/estadisticas` | Privado | Estadísticas personales de favoritos |

### Favoritos e Historial — `/api/favoritos`
> 🔒 Todos los endpoints requieren JWT

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/favoritos` | Listar favoritos (filtros: `area`, `fuente`, `etiqueta`, `leidoMasTarde`, `pagina`, `limite`) |
| `POST` | `/favoritos` | Añadir artículo a favoritos |
| `PUT` | `/favoritos/:id` | Actualizar notas, etiquetas, leer más tarde, abstract divulgativo, colección |
| `DELETE` | `/favoritos/:id` | Eliminar de favoritos |
| `GET` | `/favoritos/check` | Comprobar si un artículo está guardado (`?id=&fuente=`) |
| `POST` | `/favoritos/busqueda` | Guardar búsqueda en el historial |
| `GET` | `/favoritos/busquedas` | Obtener historial de búsquedas paginado |
| `DELETE` | `/favoritos/busquedas/:id` | Eliminar entrada del historial |
| `GET` | `/favoritos/colecciones` | Obtener nombres de colecciones con conteo |

### Administración — `/api/usuarios`
> 🔒 Requieren JWT y rol `admin`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/usuarios/estadisticas` | Estadísticas globales de la plataforma |
| `GET` | `/usuarios` | Listar todos los usuarios |
| `GET` | `/usuarios/:id` | Obtener usuario por ID |
| `PUT` | `/usuarios/:id/estado` | Activar / desactivar usuario |
| `DELETE` | `/usuarios/:id` | Eliminar usuario y todos sus favoritos |

---

## 🖥️ Páginas del Frontend

| Ruta | Página | Auth | Descripción |
|---|---|---|---|
| `/` | `HomePage` | Pública | Portada con buscador, temas tendencia y áreas científicas |
| `/buscar` | `BuscarPage` | Pública | Resultados con filtros avanzados y paginación |
| `/areas` | `AreasPage` | Pública | Cuadrícula de 12 áreas científicas |
| `/areas/:areaId` | `AreaDetallePage` | Pública | Artículos filtrados por área |
| `/articulo/:fuente/:id` | `ArticuloPage` | Pública | Detalle, modo divulgativo, exportar cita |
| `/recomendados` | `RecomendacionesPage` | Pública | Artículos según áreas de interés del usuario |
| `/comparar` | `ComparadorPage` | Pública | Comparador de hasta 3 artículos en paralelo |
| `/login` | `LoginPage` | Pública | Formulario de inicio de sesión |
| `/registro` | `RegistroPage` | Pública | Formulario de registro |
| `/favoritos` | `FavoritosPage` | **Privada** | Gestión de artículos guardados y colecciones |
| `/historial` | `HistorialPage` | **Privada** | Historial de búsquedas con paginación |
| `/estadisticas` | `EstadisticasPage` | **Privada** | KPIs y gráficos personales de lectura |
| `/perfil` | `PerfilPage` | **Privada** | Edición de perfil, avatar y contraseña |
| `/admin` | `AdminPage` | **Admin** | Panel de administración y analíticas globales |

---

## 🔐 Autenticación y Roles

- **Tipo:** JWT Bearer token
- **Almacenamiento:** `localStorage` — claves `scilens_token` y `scilens_usuario`
- **Expiración:** configurable con `JWT_EXPIRES_IN` (por defecto `7d`)
- **Roles:** `usuario` (por defecto) | `admin`
- **Middleware `proteger`:** extrae el token del header `Authorization: Bearer <token>`, lo verifica con `JWT_SECRET` y comprueba que el usuario existe y tiene `activo === true`.
- **Middleware `soloAdmin`:** verifica que `rol === 'admin'`.
- **Auto-logout:** el interceptor de Axios elimina el token y redirige a `/login` ante cualquier respuesta `401`.
- **Contraseñas:** hasheadas con bcrypt (10 rondas) mediante hook `pre('save')` de Mongoose.
- **`PrivateRoute`:** componente React que redirige a `/login` si el usuario no está autenticado.

---

## 🗄️ Modelos de Base de Datos

### `User`

| Campo | Tipo | Restricciones |
|---|---|---|
| `nombre` | String | Requerido, 2–50 caracteres |
| `email` | String | Requerido, único, minúsculas, regex validado |
| `password` | String | Requerido, min. 6 chars, `select: false`, hasheado con bcrypt |
| `avatar` | String | Por defecto `''` |
| `rol` | String enum | `'usuario'` \| `'admin'`, por defecto `'usuario'` |
| `areasInteres` | [String] | Por defecto `[]` |
| `activo` | Boolean | Por defecto `true` |
| `createdAt` / `updatedAt` | Date | Automático (timestamps) |

### `ArticuloFavorito`

| Campo | Tipo | Notas |
|---|---|---|
| `usuario` | ObjectId → User | Requerido |
| `articuloId` | String | ID externo (arXiv ID, DOI, paperId) |
| `fuente` | String enum | `arxiv` \| `crossref` \| `otro` |
| `titulo` | String | Requerido |
| `autores` | [String] | |
| `anio` | Number | |
| `abstract` | String | |
| `abstractDivulgativo` | String | Resumen en lenguaje divulgativo |
| `area` | String | |
| `palabrasClave` | [String] | |
| `urlOriginal` | String | |
| `urlPdf` | String | |
| `revista` | String | |
| `notas` | String | Máx. 1000 caracteres |
| `etiquetas` | [String] | |
| `leidoMasTarde` | Boolean | Por defecto `false` |
| `coleccion` | String | Por defecto `''` |
| — | — | Índice compuesto único: `{usuario, articuloId, fuente}` |

### `Busqueda`

| Campo | Tipo | Notas |
|---|---|---|
| `usuario` | ObjectId → User | Requerido |
| `termino` | String | Requerido |
| `fuente` | String enum | `arxiv` \| `crossref` \| `todas` |
| `area` | String | |
| `resultados` | Number | Por defecto `0` |
| `createdAt` | Date | Automático (timestamps) |

---

## 🌐 APIs Externas Consumidas

| API | URL base | Autenticación | Notas |
|---|---|---|---|
| arXiv | `https://export.arxiv.org/api/query` | Ninguna | Feed XML, parseado con regex |
| CrossRef | `https://api.crossref.org/works` | Ninguna | REST/JSON |

---

## 🧪 Testing con Postman/Thunder Client

### Ejemplos de Peticiones

**1. Buscar artículos en arXiv:**
```
GET http://localhost:3000/api/articulos/arxiv/buscar?q=machine+learning&pagina=1&limite=10
```

**2. Buscar en CrossRef con filtro de autor:**
```
GET http://localhost:3000/api/articulos/crossref/buscar?q=neural+networks&autor=Hinton
```

**3. Registrar usuario:**
```
POST http://localhost:3000/api/auth/registro
Content-Type: application/json

{
  "nombre": "Usuario Ejemplo",
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**4. Iniciar sesión:**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**5. Añadir artículo a favoritos (requiere token):**
```
POST http://localhost:3000/api/favoritos
Authorization: Bearer <tu_token>
Content-Type: application/json

{
  "articuloId": "2301.00001",
  "fuente": "arxiv",
  "titulo": "Título del artículo",
  "autores": ["Autor Uno", "Autor Dos"],
  "anio": 2023,
  "abstract": "Resumen del artículo...",
  "area": "Computer Science"
}
```

**6. Obtener estadísticas personales:**
```
GET http://localhost:3000/api/articulos/estadisticas
Authorization: Bearer <tu_token>
```

---

## 🎯 Estado del Proyecto

### ✅ Backend
- [x] Conexión a MongoDB con Mongoose
- [x] Autenticación JWT con roles (usuario / admin)
- [x] Hash de contraseñas con bcrypt
- [x] Subida de avatares con Multer
- [x] Integración con arXiv (XML feed)
- [x] Integración con CrossRef (REST)
- [x] CRUD de favoritos con filtros y paginación
- [x] Historial de búsquedas
- [x] Estadísticas personales y globales
- [x] Gestión de usuarios y colecciones
- [x] Seguridad: helmet, CORS, rate limiting
- [x] Script de creación del admin inicial

### ✅ Frontend
- [x] SPA con React + TypeScript + Vite
- [x] Enrutamiento con React Router DOM
- [x] Contexto global de autenticación y tema
- [x] Búsqueda unificada con filtros avanzados
- [x] Buscador con autoguardado de historial
- [x] Detalle de artículo con modo divulgativo
- [x] Comparador de hasta 3 artículos
- [x] CRUD de favoritos con paginación
- [x] Historial de búsquedas paginado
- [x] Estadísticas con Chart.js (línea, barras, tarta)
- [x] Exploración por 12 áreas científicas
- [x] Perfil con avatar, nombre y áreas de interés
- [x] Cambio de contraseña
- [x] Panel de administración con gestión de usuarios
- [x] Tema claro/oscuro persistente
- [x] Rutas privadas con `PrivateRoute`
- [x] Auto-logout en respuesta 401

---

## 👨‍💻 Autor

**Luis**
Trabajo de Fin de Grado — Desarrollo de Aplicaciones Web

**Fecha:** 2026

**Repositorio:** [github.com/LuissRG18/TFG](https://github.com/LuissRG18/TFG)

---

## 📄 Licencia

Proyecto académico — Trabajo de Fin de Grado. Uso con fines educativos.
