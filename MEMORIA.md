# MEMORIA DEL PROYECTO — SciLens

**Trabajo de Fin de Grado | Desarrollo de Aplicaciones Web**

---

## 1. INICIACIÓN Y PLANIFICACIÓN DEL PROYECTO

### 1.1 Descripción del Proyecto

SciLens es una plataforma web de acceso abierto al conocimiento científico cuyo objetivo principal es centralizar la búsqueda, visualización y gestión de artículos académicos procedentes de múltiples fuentes como **arXiv**, **CrossRef** y **OpenAlex** en una única interfaz moderna, segura e intuitiva.

La motivación del proyecto surge de la dispersión del conocimiento científico en múltiples repositorios con interfaces dispares, formatos distintos y barreras de acceso inconsistentes. SciLens propone una capa unificada sobre estas fuentes que facilita tanto el acceso casual al conocimiento científico como la gestión sistemática de literatura académica para usuarios con necesidades más avanzadas.

El sistema implementa las siguientes funcionalidades principales:

- **Búsqueda unificada** en arXiv, CrossRef y OpenAlex con filtros por área científica, fuente y paginación
- **Visualización detallada** de artículos con abstract, autores, año, palabras clave y enlaces al PDF y fuente original
- **Modo de lectura divulgativa** mediante resúmenes simplificados (`abstractDivulgativo`) editables por el propio usuario
- **Comparador de artículos** para contrastar hasta tres artículos en paralelo (título, autores, año, fuente, abstract, palabras clave)
- **Sistema de favoritos** con etiquetas personalizadas, notas privadas, marcado de lectura pendiente y organización en colecciones
- **Historial de búsquedas** paginado con eliminación individual de entradas
- **Estadísticas personales** con gráficos interactivos de artículos guardados por año, por área y por fuente (Chart.js)
- **Exploración por áreas científicas** con 12 categorías mapeadas a categorías nativas de arXiv
- **Recomendaciones personalizadas** basadas en las áreas de interés declaradas en el perfil
- **Exportación de citas** en formatos APA, MLA, BibTeX y RIS
- **Noticias científicas** actualizadas mediante agregación de feeds RSS con caché TTL de 1 hora
- **Página especial Artemis II** con información divulgativa sobre la misión espacial
- **Autenticación con JWT** con expiración configurable (7 días por defecto)
- **Panel de administración** con gestión de usuarios, estadísticas globales y activación/desactivación de cuentas
- **Despliegue en producción** con dominio seguro HTTPS en Vercel

Quedan fuera del alcance del proyecto la indexación propia de artículos, sistemas de pago, mensajería entre usuarios o generación de contenido científico original.

### 1.2 Análisis de Viabilidad

El proyecto es técnicamente viable utilizando tecnologías modernas ampliamente adoptadas en la industria:

| Capa | Tecnología | Versión |
|---|---|---|
| Backend | Node.js + Express | Express 5.x, Node.js LTS |
| Frontend | React + TypeScript + Vite | React 19, TypeScript 5.9, Vite 8 |
| Base de datos | MongoDB Atlas | Mongoose 9.x, plan M0 (gratuito) |
| Autenticación | JSON Web Tokens | jsonwebtoken 9.x + bcryptjs 3.x |
| HTTP Client | Axios | 1.x (frontend y backend) |
| Gráficos | Chart.js + react-chartjs-2 | Chart.js 4.x |
| Iconografía | Lucide React | 0.577.x |
| Despliegue | Vercel | Serverless Node.js + CDN estático |

Las APIs externas utilizadas (arXiv Atom/XML, CrossRef REST y OpenAlex REST) son públicas y no requieren autenticación, lo que elimina cualquier dependencia de claves de terceros para las funcionalidades de búsqueda. OpenAlex admite un parámetro opcional `mailto` para acceder al "polite pool" (mayores cuotas), configurable mediante la variable de entorno `OPENALEX_EMAIL`.

La infraestructura se basa íntegramente en planes gratuitos: Vercel para frontend y backend serverless, MongoDB Atlas M0 para base de datos, y APIs académicas públicas sin cuota. Esto garantiza que el proyecto sea reproducible y evaluable sin coste económico.

El desarrollo completo se realizó por un único desarrollador durante aproximadamente 16 semanas con una dedicación estimada de 192 horas de trabajo.

### 1.3 Planificación Temporal

El desarrollo del proyecto se organizó en ocho fases secuenciales con algunas solapadas al final:

| Fase | Descripción | Periodo aproximado |
|---|---|---|
| 1 | Definición del alcance y análisis de requisitos | Semanas 1–2 |
| 2 | Diseño técnico, modelo de datos y wireframes en Figma | Semanas 2–4 |
| 3 | Desarrollo del backend (modelos, rutas, controladores, seguridad) | Semanas 4–7 |
| 4 | Desarrollo del frontend (componentes, páginas, contextos, servicios) | Semanas 6–12 |
| 5 | Integración frontend-backend y pruebas progresivas | Semanas 11–13 |
| 6 | Pruebas de calidad (Jest, Supertest, Vitest, pruebas manuales) | Semanas 13–14 |
| 7 | Despliegue en producción en Vercel con dominio HTTPS | Semana 14–15 |
| 8 | Redacción de la memoria y preparación de la defensa oral | Semanas 14–16 |

El diagrama de Gantt completo con todas las tareas y subtareas se incluye en el Anexo I.

### 1.4 Asignación de Roles

El proyecto ha sido desarrollado íntegramente por un único estudiante que ha asumido los siguientes roles de forma simultánea:

| Rol | Responsabilidades principales |
|---|---|
| Analista de requisitos | Definición del alcance, casos de uso, identificación de fuentes de datos |
| Diseñador UI/UX | Wireframes en Figma, sistema de diseño, modo oscuro/claro, responsividad |
| Desarrollador Backend | API REST con Express, controladores MVC, autenticación JWT, seguridad |
| Desarrollador Frontend | SPA con React + TypeScript, componentes, contextos, servicios Axios |
| Administrador de base de datos | Diseño de esquemas Mongoose, índices, TTL, conexión serverless-safe |
| DevOps | Despliegue en Vercel, variables de entorno, integración continua via GitHub |
| QA Tester | Pruebas con Jest/Supertest (backend) y Vitest/Testing Library (frontend) |
| Redactor de documentación | Memoria del proyecto, documentación de endpoints y anexos |

---

## 2. ANÁLISIS Y DISEÑO

### 2.1 Arquitectura del Sistema

La aplicación sigue una arquitectura **cliente-servidor completamente desacoplada**, con frontend y backend desplegados de forma independiente en Vercel:

```
┌───────────────────────────────────────────────────────────┐
│                    CLIENTE (Vercel CDN)                    │
│   React 19 + TypeScript + Vite  →  Aplicación SPA estática│
│   Axios → interceptors JWT automáticos                     │
└─────────────────────────┬─────────────────────────────────┘
                          │ HTTPS / JSON
┌─────────────────────────▼─────────────────────────────────┐
│               BACKEND (Vercel Serverless)                  │
│   Node.js + Express 5  →  API REST /api/*                  │
│   Helmet · CORS · Rate Limiting · JWT Middleware           │
└──────────────┬────────────────────────┬───────────────────┘
               │ Mongoose               │ Axios
┌──────────────▼──────────┐  ┌──────────▼──────────────────┐
│   MongoDB Atlas (M0)    │  │   APIs Externas              │
│   Users · Favoritos     │  │   arXiv (Atom/XML)           │
│   Búsquedas · Noticias  │  │   CrossRef (REST/JSON)       │
└─────────────────────────┘  │   OpenAlex (REST/JSON)       │
                             │   RSS Feeds (Noticias)       │
                             └─────────────────────────────┘
```

**Backend:** API REST desarrollada con Node.js y Express 5 siguiendo el patrón MVC. Gestiona autenticación, lógica de negocio y acceso a base de datos mediante Mongoose. La configuración de conexión a MongoDB incluye caché de conexión (`global.mongoose`) para reutilizar la conexión entre invocaciones serverless y evitar el agotamiento del pool de conexiones.

**Frontend:** Aplicación SPA desarrollada con React 19 y TypeScript 5.9 utilizando Vite 8 como entorno de desarrollo. La comunicación con el backend se realiza mediante Axios con interceptores que adjuntan automáticamente el token JWT a cada petición y redirigen al login ante respuestas 401.

**Base de datos:** MongoDB Atlas (plan M0 gratuito) en la nube con tres colecciones principales definidas mediante Mongoose: `users`, `articulofavoritos` y `busquedas`. La colección `noticias` utiliza un índice TTL que elimina documentos automáticamente 1 hora después de su caché.

### 2.2 Modelo de Datos

#### Colección `users`

| Campo | Tipo | Validaciones / Notas |
|---|---|---|
| `nombre` | String | Obligatorio, 2–50 caracteres |
| `email` | String | Único, formato válido, lowercase |
| `password` | String | Mínimo 6 caracteres, `select: false`, hasheado con bcrypt |
| `avatar` | String | URL relativa a `/public/avatars/` |
| `rol` | String | `enum: ['usuario', 'admin']`, default `'usuario'` |
| `areasInteres` | [String] | Array de IDs de área científica |
| `activo` | Boolean | Permite desactivar cuentas sin eliminar datos |
| `createdAt` / `updatedAt` | Date | Automático vía `timestamps: true` |

El hook `pre('save')` hashea la contraseña con bcryptjs (10 rondas de salt) únicamente cuando el campo ha sido modificado. El método de instancia `compararPassword(pwd)` realiza la comparación segura con `bcrypt.compare`.

#### Colección `articulofavoritos`

| Campo | Tipo | Notas |
|---|---|---|
| `usuario` | ObjectId (ref User) | Clave foránea |
| `articuloId` | String | ID externo (arXiv ID, DOI CrossRef o Work ID de OpenAlex) |
| `fuente` | String | `enum: ['arxiv', 'crossref', 'openalex', 'otro']` |
| `titulo`, `autores`, `anio`, `abstract` | — | Copia local del artículo en el momento del guardado |
| `abstractDivulgativo` | String | Resumen simplificado editable por el usuario |
| `area`, `palabrasClave`, `urlOriginal`, `urlPdf`, `revista` | — | Metadatos del artículo |
| `notas` | String | Máximo 1000 caracteres |
| `etiquetas` | [String] | Etiquetas libres |
| `leidoMasTarde` | Boolean | Default false |
| `coleccion` | String | Nombre de colección personalizada |

Índice compuesto único sobre `{ usuario, articuloId, fuente }` para prevenir duplicados.

#### Colección `busquedas`

| Campo | Tipo | Notas |
|---|---|---|
| `usuario` | ObjectId (ref User) | — |
| `termino` | String | Término de búsqueda |
| `fuente` | String | `enum: ['arxiv', 'crossref', 'openalex', 'todas']` |
| `area` | String | Filtro de área aplicado |
| `resultados` | Number | Número de resultados obtenidos |

#### Colección `noticias`

| Campo | Tipo | Notas |
|---|---|---|
| `titulo`, `resumen`, `url` | String | Campos del item RSS |
| `imagen` | String \| null | URL extraída de `media:content`, `media:thumbnail`, `enclosure` o `<img>` en el contenido |
| `fuente` | String | Nombre del medio (SINC, El País Ciencia, Nature, etc.) |
| `idioma` | String | `enum: ['es', 'en']` |
| `fecha` | Date | Fecha de publicación del artículo RSS |
| `cachedAt` | Date | Índice TTL, elimina documentos tras 3600 segundos |

### 2.3 Diseño de la Interfaz

El frontend sigue un sistema de diseño coherente con soporte completo de **modo oscuro y claro** gestionado mediante `ThemeContext`. Los principales principios de diseño aplicados son:

- **Consistencia visual** mediante variables CSS globales para colores, bordes y sombras
- **Responsividad** verificada en resoluciones de escritorio (≥1280 px), tablet (768–1279 px) y móvil (<768 px)
- **Accesibilidad** con contraste de colores adecuado y navegación por teclado en formularios
- **Feedback al usuario** en todos los estados de carga (`Loader2`), error (`error-banner`) y vacío

Los wireframes de baja fidelidad y los diseños finales de alta fidelidad se realizaron con Figma antes de la implementación (ver Anexo IV).

### 2.4 Seguridad

La aplicación implementa diversas medidas de seguridad alineadas con OWASP Top 10:

| Medida | Implementación | Amenaza mitigada |
|---|---|---|
| **Helmet** | Cabeceras HTTP seguras (CSP, X-Frame-Options, HSTS, etc.) | A05: Security Misconfiguration |
| **CORS** | Lista blanca explícita de dominios autorizados + regex para previews de Vercel | A01: Broken Access Control |
| **Rate limiting** | 20 req/15 min en `/api/auth/*`; 200 req/15 min en rutas generales | A07: Identification and Auth Failures |
| **JWT** | Tokens firmados con `JWT_SECRET`, expiración 7 días, verificación en cada petición privada | A07: Identification and Auth Failures |
| **bcryptjs** | Hash de contraseñas con 10 rondas de salt, `select: false` en el esquema | A02: Cryptographic Failures |
| **Multer** | Validación de tipo MIME (`image/jpeg`, `image/png`, `image/webp`, `image/gif`) y límite de 2 MB | A04: Insecure Design |
| **Variables de entorno** | `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL` gestionadas fuera del repositorio | A02: Cryptographic Failures |
| **Middleware `proteger`** | Verifica token y que el usuario existe y está activo antes de acceder a rutas privadas | A01: Broken Access Control |
| **Middleware `soloAdmin`** | Verifica rol `admin` en rutas de administración | A01: Broken Access Control |
| **Eliminación en cascada** | Al eliminar un usuario se eliminan también sus favoritos y búsquedas | A04: Insecure Design |

---

## 3. IMPLEMENTACIÓN

### 3.1 Entorno y Herramientas de Desarrollo

El desarrollo se realizó con **Visual Studio Code** como editor principal, con control de versiones mediante **Git** y repositorio remoto en **GitHub**. Las pruebas de endpoints durante el desarrollo se realizaron con **Postman**.

Variables de entorno locales gestionadas con el paquete `dotenv`. Los valores de producción se configuran en el panel de Vercel sin exponerlos en el repositorio.

### 3.2 Backend — Estructura y Organización

El backend sigue el patrón **MVC (Modelo-Vista-Controlador)** adaptado a una API REST sin capa de vistas:

```
backend/src/
├── app.js               # Punto de entrada: Express, middleware, rutas
├── config/
│   └── db.js            # Conexión Mongoose con caché serverless-safe
├── middleware/
│   └── auth.js          # proteger() y soloAdmin()
├── models/
│   ├── User.js          # Esquema usuario + hook bcrypt + método compararPassword
│   ├── ArticuloFavorito.js  # Esquema favorito con índice único compuesto
│   ├── Busqueda.js      # Historial de búsquedas
│   └── Noticia.js       # Noticias con TTL index (1 hora)
├── controllers/
│   ├── authController.js       # registro, login, obtenerPerfil, actualizarPerfil, cambiarPassword, subirAvatar
│   ├── articulosController.js  # buscarArxiv, obtenerArxivPorId, buscarCrossRef, buscarOpenAlex, obtenerOpenAlexPorId, obtenerEstadisticas
│   ├── favoritosController.js  # CRUD favoritos + guardarBusqueda + obtenerBusquedas + obtenerColecciones
│   ├── usuariosController.js   # Admin: listar, obtener, cambiarEstado, eliminar, estadisticasGlobales
│   └── noticiasController.js   # fetchAndCache (RSS), obtenerNoticias
├── routes/
│   ├── authRoutes.js
│   ├── articulosRoutes.js
│   ├── favoritosRoutes.js
│   ├── usuariosRoutes.js
│   └── noticiasRoutes.js
└── scripts/
    └── createAdmin.js   # Script de seed para crear el primer usuario administrador
```

#### Punto de entrada (`app.js`)

El fichero `app.js` configura, en orden:

1. `helmet()` — cabeceras de seguridad HTTP
2. `cors()` — con lógica de lista blanca + regex para URLs de Vercel preview
3. `generalLimiter` — rate limit de 200 req/15 min aplicado globalmente
4. `express.json()` y `express.urlencoded()` — parseo de cuerpos de petición
5. Servicio de archivos estáticos en `/public` (avatares de usuarios)
6. Endpoint de diagnóstico `GET /api/ping` (sin conexión a BD, para verificar arranque serverless)
7. Middleware de conexión a MongoDB (serverless-safe con caché global)
8. Registro de rutas con prefijo `/api/*`, añadiendo `authLimiter` estricto sobre `/api/auth`

#### Integración con APIs Externas

**arXiv (Atom/XML):** Se construye la URL de consulta a `https://export.arxiv.org/api/query` con los parámetros `search_query` (con soporte de filtro por categoría mediante `ARXIV_CAT_MAP`), `start`, `max_results`, `sortBy=relevance` y `sortOrder=descending`. La respuesta XML se parsea con expresiones regulares para extraer los campos de cada `<entry>`. El mapeado de áreas internas a prefijos de categoría de arXiv (`cs`, `math`, `q-bio`, `astro-ph`, `eess`, etc.) se realiza en el servidor.

**CrossRef (REST/JSON):** Se consulta `https://api.crossref.org/works` con los parámetros `query`, `query.author`, `offset`, `rows` y `sort=relevance`. La respuesta JSON se normaliza al mismo formato interno que los artículos de arXiv (`id`, `fuente`, `titulo`, `autores`, `anio`, `abstract`, `palabrasClave`, `urlOriginal`, `urlPdf`, `revista`, `citaciones`).

**OpenAlex (REST/JSON):** Se consulta `https://api.openalex.org/works` con los parámetros `search`, `page`, `per-page`, `filter` (combina `concepts.id`, `publication_year:>=`, `publication_year:<=` y `cited_by_count:>=`) y `sort` opcional (`publication_year:desc` o `cited_by_count:desc`). El mapeado de áreas internas a *concept IDs* de OpenAlex (nivel-0: `C41008148` para Computer science, `C71924100` para Medicine, etc.) se realiza en el servidor mediante `OPENALEX_CONCEPT_MAP`. El abstract se devuelve como índice invertido (`abstract_inverted_index: { palabra: [posiciones] }`) y se reconstruye en el backend antes de enviarse al frontend. La URL del PDF se obtiene priorizando `best_oa_location.pdf_url`, después `primary_location.pdf_url` y por último `open_access.oa_url` cuando el artículo es open-access, lo que permite exponer el botón de PDF directamente en la tarjeta para la mayoría de resultados. La variable de entorno opcional `OPENALEX_EMAIL` añade el parámetro `mailto` para acceder al *polite pool* de OpenAlex con cuotas más generosas.

**RSS Feeds (Noticias):** El controlador `noticiasController.js` procesa feeds de 6 fuentes (SINC, El País Ciencia, National Geographic, Muy Interesante, Phys.org, Nature) en español e inglés mediante `rss-parser`. Las noticias se filtran por relevancia científica exigiendo que el título contenga al menos una de ~50 palabras clave científicas y descartando señales de contenido político. Las imágenes se extraen de múltiples namespaces RSS (`media:content`, `media:thumbnail`, `enclosure`, `<img>` en el contenido). Los resultados se cachean en MongoDB con TTL de 1 hora para evitar llamadas repetidas a las fuentes externas.

### 3.3 Frontend — Estructura y Organización

```
frontend/src/
├── main.tsx             # Punto de entrada React + montaje del DOM
├── App.tsx              # BrowserRouter, rutas, ScrollToTop
├── App.css / index.css  # Estilos globales + sistema de diseño + modo oscuro
├── assets/              # Imágenes y recursos estáticos (comprimidos con sharp)
├── components/
│   ├── Navbar.tsx       # Barra de navegación con detección de ruta activa y menú móvil
│   ├── Footer.tsx
│   ├── ArtemisHero.tsx  # Hero widget de la misión Artemis II
│   ├── ArticuloCard.tsx # Tarjeta resumida de artículo científico
│   ├── NoticiaCard.tsx  # Tarjeta de noticia científica
│   ├── SearchBar.tsx    # Barra de búsqueda reutilizable
│   └── PrivateRoute.tsx # HOC que redirige al login si no hay sesión activa
├── context/
│   ├── AuthContext.tsx  # Estado global de sesión + persistencia en localStorage
│   └── ThemeContext.tsx # Estado global de tema claro/oscuro
├── pages/
│   ├── HomePage.tsx          # Portada con hero, búsqueda destacada y noticias recientes
│   ├── BuscarPage.tsx        # Búsqueda con filtros de fuente y área, paginación
│   ├── AreasPage.tsx         # Cuadrícula de las 12 áreas científicas
│   ├── AreaDetallePage.tsx   # Artículos de una área específica con paginación
│   ├── ArticuloPage.tsx      # Detalle completo con export de citas, botón de favorito
│   ├── FavoritosPage.tsx     # Lista de favoritos con filtros, edición inline y colecciones
│   ├── HistorialPage.tsx     # Historial de búsquedas con eliminación individual
│   ├── EstadisticasPage.tsx  # Dashboard personal con gráficos Bar, Pie y Line (Chart.js)
│   ├── ComparadorPage.tsx    # Comparación en tabla de hasta 3 artículos
│   ├── RecomendacionesPage.tsx  # Artículos recomendados según áreas de interés del perfil
│   ├── ArtemisPage.tsx       # Página divulgativa especial sobre la misión Artemis II
│   ├── NoticiasPage.tsx      # Feed de noticias científicas en español e inglés
│   ├── LoginPage.tsx         # Formulario de inicio de sesión
│   ├── RegistroPage.tsx      # Formulario de registro con selección de áreas de interés
│   ├── PerfilPage.tsx        # Edición de perfil, cambio de contraseña y subida de avatar
│   └── AdminPage.tsx         # Panel de administración (solo rol admin)
├── services/
│   ├── api.ts               # Instancia Axios con baseURL, timeout e interceptores JWT/401
│   ├── authService.ts       # loginRequest, registroRequest, obtenerPerfil, actualizarPerfil, etc.
│   ├── articulosService.ts  # buscarArxiv, buscarCrossRef, buscarOpenAlex, obtenerArxivPorId, obtenerOpenAlexPorId, obtenerEstadisticas
│   ├── favoritosService.ts  # CRUD favoritos, checkFavorito, historial, colecciones
│   └── noticiasService.ts   # obtenerNoticias
├── types/
│   └── index.ts             # Interfaces TypeScript: Articulo, Usuario, Favorito, BusquedaHistorial,
│                            #   Estadisticas, EstadisticasGlobales, Noticia, AREAS_CIENTIFICAS
└── utils/
    └── exportCitation.ts    # formatAPA, formatMLA, formatBibtex, formatRIS, downloadText
```

#### Estado Global

La aplicación gestiona dos contextos globales con React Context API:

- **`AuthContext`**: Almacena `usuario` (datos del perfil) y `token` (JWT). Persiste en `localStorage` con las claves `scilens_token` y `scilens_usuario`. Expone `login`, `registro`, `logout` y `actualizarUsuario` (para actualizaciones parciales del perfil sin nuevo login).
- **`ThemeContext`**: Controla el tema claro/oscuro mediante una clase CSS en el elemento raíz, persistiendo la preferencia del usuario.

#### Rutas Protegidas

El componente `PrivateRoute` envuelve las rutas que requieren autenticación (`/favoritos`, `/historial`, `/estadisticas`, `/perfil`, `/admin`). Si `loading` es `true` muestra un spinner; si no hay sesión activa, redirige a `/login`.

#### Exportación de Citas

El módulo `exportCitation.ts` implementa cuatro formatos de exportación bibliográfica:
- **APA**: `Apellido, I. (año). Título. *Revista*. URL`
- **MLA**: `Autores. "Título." *Revista*, año. URL`
- **BibTeX**: entrada `@article{ClaveCita, ...}` lista para importar en LaTeX
- **RIS**: formato estándar compatible con gestores como Zotero o Mendeley

La descarga se realiza mediante la API `Blob` + creación de enlace temporal sin dependencias externas.

#### Estadísticas Personales

La página `EstadisticasPage` muestra tres gráficas interactivas con Chart.js:
- **Gráfico de línea** con artículos guardados por año (2015–actual) y línea de tendencia de media móvil de 3 años
- **Gráfico de barras** con distribución por área científica
- **Gráfico de tarta** con distribución por fuente (arXiv / CrossRef / OpenAlex)

#### Panel de Administración

La página `AdminPage` (accesible solo con rol `admin`) muestra:
- Estadísticas globales de la plataforma: total de usuarios, usuarios activos, favoritos guardados y búsquedas realizadas
- Gráfico de usuarios registrados por mes
- Tabla de usuarios con opciones de activar/desactivar y eliminar cuentas

### 3.4 Integración Frontend-Backend

La integración se realizó de forma progresiva, verificando cada endpoint con Postman antes de conectarlo a la interfaz de usuario. El cliente Axios está configurado con:

- `baseURL`: `VITE_API_URL` o `http://localhost:3000/api` en desarrollo
- `timeout`: 15 segundos para tolerar latencias de APIs externas
- Interceptor de petición: adjunta `Authorization: Bearer <token>` si existe token en `localStorage`
- Interceptor de respuesta: ante error 401, limpia el almacenamiento y redirige al login

---

## 4. PRUEBAS Y CONTROL DE CALIDAD

### 4.1 Estrategia de Pruebas

Se adoptó una estrategia de pruebas multicapa que combina pruebas automatizadas con pruebas manuales exploratorias:

| Capa | Herramienta | Tipo de prueba |
|---|---|---|
| Backend | Jest + Supertest | Unitarias e integración de endpoints HTTP |
| Frontend | Vitest + Testing Library | Pruebas de componentes React |
| Manual | Chrome DevTools + Postman | Funcional, responsividad, usabilidad |

### 4.2 Pruebas de Backend (Jest + Supertest)

Las pruebas de backend verifican directamente los endpoints HTTP de la API REST. Supertest permite realizar peticiones HTTP a la aplicación Express en memoria sin necesidad de levantar un servidor real.

Los casos de prueba implementados cubrieron:

1. **Registro y login de usuarios**: respuestas 201/200 con token JWT, manejo de email duplicado (400), credenciales inválidas (401)
2. **Protección de rutas privadas**: respuesta 401 ante petición sin token, respuesta 401 ante token inválido o expirado
3. **Acceso restringido para administradores**: respuesta 403 ante rol insuficiente en endpoints `/api/usuarios/*`
4. **CRUD completo de favoritos**: creación (201), listado con filtros, actualización parcial (notas, etiquetas, colección), eliminación (200), comprobación de duplicados (400)
5. **Funcionamiento de tokens JWT**: generación, validación y rechazo de tokens manipulados
6. **Rate limiting de autenticación**: verificación de respuesta 429 al superar el límite de 20 peticiones en 15 minutos

### 4.3 Pruebas de Frontend (Vitest + Testing Library)

Las pruebas de componentes verifican el comportamiento visual y de interacción de los componentes React. Testing Library permite consultar el DOM renderizado de forma semántica (por roles, textos y etiquetas accesibles).

Los casos implementados incluyeron:

- Renderizado correcto del componente `ArticuloCard` con los datos del artículo
- Comportamiento de `PrivateRoute`: renderizado del componente hijo si hay sesión, redirección si no
- Formularios de `LoginPage` y `RegistroPage`: validación de campos, envío y manejo de errores

### 4.4 Pruebas Manuales

Se realizaron pruebas manuales exhaustivas en las siguientes dimensiones:

- **Compatibilidad de navegadores**: Chrome, Firefox y Edge (versiones actuales)
- **Responsividad**: resoluciones de 360 px (móvil), 768 px (tablet), 1280 px y 1920 px (escritorio)
- **Flujos de usuario completos**: registro → búsqueda → guardar favorito → ver estadísticas → exportar cita
- **Flujo de administración**: login como admin → ver estadísticas globales → desactivar usuario → eliminar usuario
- **Comportamiento de caché de noticias**: verificación del TTL de 1 hora y refrescado automático

---

## 5. DESPLIEGUE

### 5.1 Plataforma

La aplicación se despliega íntegramente en la plataforma **Vercel**, que ofrece integración continua con GitHub y plan gratuito suficiente para los volúmenes de este proyecto.

| Componente | Tipo de despliegue | URL de producción |
|---|---|---|
| Frontend | Aplicación estática con CDN global | `https://frontend-eta-nine-95.vercel.app` |
| Backend | Funciones serverless Node.js | `https://backend-scilens.vercel.app` |

### 5.2 Configuración del Backend (`vercel.json`)

```json
{
  "version": 2,
  "builds": [{ "src": "src/app.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/app.js" }]
}
```

Todas las rutas se redirigen a `app.js`, que actúa como función serverless única. La conexión a MongoDB utiliza caché en `global.mongoose` para reutilizar la conexión entre invocaciones frías y calientes.

### 5.3 Variables de Entorno en Producción

| Variable | Descripción |
|---|---|
| `MONGODB_URI` | Cadena de conexión a MongoDB Atlas |
| `JWT_SECRET` | Secreto para firmar y verificar tokens JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (default `7d`) |
| `FRONTEND_URL` | URL(s) permitidas en CORS (separadas por coma) |
| `OPENALEX_EMAIL` | (Opcional) Email para el *polite pool* de OpenAlex (mayores cuotas de rate-limit) |
| `VITE_API_URL` | URL base de la API (variable de entorno de Vite en el frontend) |

Ninguna de estas variables se incluye en el repositorio de código fuente. Se configuran exclusivamente desde el panel de Vercel.

### 5.4 Integración Continua

Cada `push` o `pull request` al repositorio GitHub desencadena automáticamente un nuevo despliegue en Vercel. Las ramas de feature generan URLs de preview independientes. La rama principal (`main`) despliega en producción. No se requiere intervención manual para actualizar la aplicación.

### 5.5 Optimización del Frontend

Las imágenes de la aplicación se comprimen previamente con el script `scripts/compress-images.mjs` que utiliza la librería `sharp` para generar versiones `.webp` optimizadas, reduciendo el tiempo de carga inicial de la página.

---

## 6. CONCLUSIONES

SciLens demuestra la aplicación práctica e integrada de los conocimientos adquiridos durante el ciclo formativo de Desarrollo de Aplicaciones Web, abordando un problema real de accesibilidad al conocimiento científico con una solución técnica completa y desplegada en producción.

El proyecto ha supuesto la aplicación simultánea de competencias en múltiples disciplinas: diseño de APIs REST, modelado de bases de datos NoSQL, desarrollo de interfaces SPA reactivas, implementación de medidas de seguridad, integración de APIs externas heterogéneas (XML, JSON, RSS) y gestión del ciclo completo de despliegue en entornos serverless.

Entre los aspectos más destacados de la implementación cabe señalar:

- La arquitectura desacoplada permite escalar o reemplazar frontend y backend de forma independiente
- El sistema de caché serverless-safe para MongoDB evita el agotamiento de conexiones en entornos de función como Vercel
- La exportación de citas en cuatro formatos (APA, MLA, BibTeX, RIS) aporta un valor diferencial para usuarios académicos
- El filtrado de noticias por relevancia científica con análisis de palabras clave en título garantiza la calidad del feed sin depender de APIs de terceros de pago
- El sistema de colecciones y etiquetas libre dentro de favoritos proporciona flexibilidad sin rigidez estructural

### Dificultades encontradas

- La parseo manual del formato Atom/XML de arXiv (sin librería dedicada) requirió un manejo cuidadoso de expresiones regulares para extraer campos con formato irregular
- La adaptación del backend a entornos serverless (sin estado persistente entre invocaciones) obligó a repensar la gestión de la conexión a MongoDB y el rate limiting (desactivado el store distribuido con `validate: false`)
- La coordinación entre el sistema de tipos TypeScript y las respuestas dinámicas de tres APIs externas con formatos distintos (XML de arXiv, JSON plano de CrossRef y JSON con índice invertido de OpenAlex) exigió un trabajo de normalización cuidadoso en los controladores

### Posibles mejoras futuras

| Mejora | Descripción |
|---|---|
| **Gamificación** | Sistema de puntos, insignias y rachas de lectura para aumentar el engagement |
| **Nuevas fuentes** | Integración de PubMed (NCBI E-utilities) o IEEE Xplore para literatura biomédica e ingeniería |
| **Notificaciones** | Alertas por email o push ante nuevas publicaciones en áreas de interés |
| **Exportación avanzada** | Generación de bibliografías completas en PDF para listas de favoritos |
| **Búsqueda semántica** | Integración con Semantic Scholar API para búsqueda por similitud semántica |
| **Colaboración** | Compartir colecciones de favoritos entre usuarios o crear listas públicas |

---

## ANEXOS

### Anexo I — Diagrama de Gantt del proyecto

*(Ver archivo adjunto)*

### Anexo II — Diagrama UML del backend

*(Ver archivo adjunto)*

---

### Anexo III — Documentación de Endpoints

**URL base producción:** `https://backend-scilens.vercel.app/api`  
**URL base local:** `http://localhost:3000/api`  
**Formato de petición/respuesta:** `application/json`  
**Autenticación:** Header `Authorization: Bearer <JWT>`

---

#### AUTH
> Rate limit: 20 peticiones / 15 minutos por IP

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/auth/registro` | Público | Registro de usuario |
| `POST` | `/auth/login` | Público | Login, devuelve JWT |
| `GET` | `/auth/perfil` | Privado (JWT) | Obtener perfil propio |
| `PUT` | `/auth/perfil` | Privado (JWT) | Actualizar nombre y áreas de interés |
| `PUT` | `/auth/cambiar-password` | Privado (JWT) | Cambio de contraseña |
| `POST` | `/auth/avatar` | Privado (JWT) | Subida de avatar (máx. 2 MB, jpg/png/webp/gif) |

**POST `/auth/registro` — Cuerpo de petición:**
```json
{
  "nombre": "María García",
  "email": "maria@example.com",
  "password": "mipassword123",
  "areasInteres": ["cs", "biology"]
}
```
**Respuesta 201:**
```json
{
  "ok": true,
  "mensaje": "Usuario registrado correctamente.",
  "token": "<JWT>",
  "usuario": { "id": "...", "nombre": "María García", "email": "...", "rol": "usuario", "areasInteres": ["cs","biology"] }
}
```

**POST `/auth/login` — Cuerpo de petición:**
```json
{ "email": "maria@example.com", "password": "mipassword123" }
```
**Respuesta 200:**
```json
{
  "ok": true,
  "token": "<JWT>",
  "usuario": { "id": "...", "nombre": "...", "email": "...", "rol": "usuario", "areasInteres": [...], "avatar": "..." }
}
```

---

#### ARTÍCULOS
> Rate limit general: 200 peticiones / 15 minutos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/articulos/arxiv/buscar` | Público | Buscar en arXiv (`?q=&area=&pagina=&limite=`) |
| `GET` | `/articulos/arxiv/:id` | Público | Obtener artículo arXiv por ID |
| `GET` | `/articulos/crossref/buscar` | Público | Buscar en CrossRef (`?q=&autor=&pagina=&limite=`) |
| `GET` | `/articulos/openalex/buscar` | Público | Buscar en OpenAlex (`?q=&area=&pagina=&limite=&anioDesde=&anioHasta=&minCitas=&orden=`) |
| `GET` | `/articulos/openalex/:id` | Público | Obtener artículo OpenAlex por Work ID (`W…`) o DOI |
| `GET` | `/articulos/estadisticas` | Privado (JWT) | Estadísticas personales de favoritos |

**GET `/articulos/arxiv/buscar?q=machine+learning&area=cs&pagina=1&limite=5`**

Parámetros de consulta:

| Parámetro | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `q` | string | Sí | Término de búsqueda |
| `area` | string | No | ID de área (`cs`, `physics`, `mathematics`, `biology`, `medicine`, `chemistry`, `economics`, `psychology`, `engineering`, `astronomy`, `environmental`, `neuroscience`) |
| `pagina` | number | No (default 1) | Página de resultados |
| `limite` | number | No (default 10) | Resultados por página |

**Respuesta 200:**
```json
{
  "ok": true,
  "total": 5,
  "articulos": [{
    "id": "2301.07218",
    "fuente": "arxiv",
    "titulo": "A Survey on Machine Learning for Scientific Discovery",
    "autores": ["Smith, J.", "Doe, A."],
    "anio": 2023,
    "abstract": "...",
    "palabrasClave": ["cs.LG", "cs.AI"],
    "urlOriginal": "https://arxiv.org/abs/2301.07218",
    "urlPdf": "https://arxiv.org/pdf/2301.07218",
    "revista": "arXiv"
  }]
}
```

---

#### FAVORITOS E HISTORIAL
> Todos los endpoints requieren JWT

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

**POST `/favoritos` — Cuerpo de petición:**
```json
{
  "articuloId": "2301.07218",
  "fuente": "arxiv",
  "titulo": "A Survey on Machine Learning...",
  "autores": ["Smith, J."],
  "anio": 2023,
  "abstract": "...",
  "area": "cs",
  "palabrasClave": ["cs.LG"],
  "urlOriginal": "https://arxiv.org/abs/2301.07218",
  "urlPdf": "https://arxiv.org/pdf/2301.07218",
  "revista": "arXiv",
  "notas": "Interesante para el capítulo 3",
  "etiquetas": ["machine-learning", "survey"],
  "coleccion": "TFG Referencia"
}
```

**PUT `/favoritos/:id` — Cuerpo de petición (todos los campos son opcionales):**
```json
{
  "notas": "Nota actualizada",
  "etiquetas": ["deep-learning"],
  "leidoMasTarde": true,
  "abstractDivulgativo": "Resumen sencillo para no especialistas",
  "coleccion": "Favoritos personales"
}
```

**GET `/favoritos/colecciones` — Respuesta 200:**
```json
{
  "ok": true,
  "colecciones": [
    { "_id": "TFG Referencia", "total": 5 },
    { "_id": "Favoritos personales", "total": 12 }
  ]
}
```

---

#### NOTICIAS

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/noticias` | Público | Obtener noticias científicas (`?idioma=es\|en`, default `es`) |

El endpoint sirve noticias desde caché MongoDB. Si la caché ha expirado (TTL 1 hora), obtiene y filtra nuevas noticias de los feeds RSS antes de responder.

---

#### USUARIOS (ADMIN)
> Requieren JWT y rol `admin`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/usuarios/estadisticas` | Estadísticas globales de la plataforma |
| `GET` | `/usuarios` | Listar todos los usuarios |
| `GET` | `/usuarios/:id` | Obtener usuario por ID |
| `PUT` | `/usuarios/:id/estado` | Activar / desactivar usuario (toggle) |
| `DELETE` | `/usuarios/:id` | Eliminar usuario y sus datos asociados |

**GET `/usuarios/estadisticas` — Respuesta 200:**
```json
{
  "ok": true,
  "estadisticas": {
    "totalUsuarios": 42,
    "totalActivos": 40,
    "totalFavoritos": 318,
    "totalBusquedas": 1204,
    "usuariosPorMes": [{ "_id": "2026-03", "total": 7 }],
    "favoritosPorFuente": [{ "_id": "arxiv", "total": 215 }, { "_id": "crossref", "total": 103 }, { "_id": "openalex", "total": 87 }],
    "busquedasPorFuente": [{ "_id": "todas", "total": 620 }]
  }
}
```

---

#### Códigos de respuesta HTTP

| Código | Significado |
|---|---|
| `200` | OK |
| `201` | Creado |
| `400` | Bad Request — parámetros inválidos o faltantes |
| `401` | Unauthorized — token ausente o inválido |
| `403` | Forbidden — rol insuficiente |
| `404` | Not Found — recurso no encontrado |
| `429` | Too Many Requests — rate limit superado |
| `500` | Internal Server Error |

Todos los errores devuelven el mismo formato:
```json
{ "ok": false, "mensaje": "Descripción del error." }
```

---

### Anexo IV — Diseños en Figma

[Ver diseños en Figma](https://www.figma.com/make/yAajNKPnmClmHglNQSjuMB/TFG?p=f&t=XwdBMv7alXbRyy0c-0&fullscreen=1)

---

### Anexo V — Dependencias del Proyecto

#### Backend (`backend/package.json`)

| Paquete | Versión | Uso |
|---|---|---|
| `express` | ^5.2.1 | Framework HTTP |
| `mongoose` | ^9.3.0 | ODM para MongoDB |
| `bcryptjs` | ^3.0.3 | Hash de contraseñas |
| `jsonwebtoken` | ^9.0.3 | Generación y verificación de JWT |
| `helmet` | ^8.1.0 | Cabeceras HTTP de seguridad |
| `cors` | ^2.8.6 | Control de acceso CORS |
| `express-rate-limit` | ^8.3.1 | Limitación de tasa de peticiones |
| `multer` | ^2.1.1 | Gestión de subida de archivos |
| `axios` | ^1.13.6 | Cliente HTTP para APIs externas |
| `rss-parser` | ^3.13.0 | Parseo de feeds RSS/Atom |
| `dotenv` | ^17.3.1 | Variables de entorno |
| `jest` + `supertest` | dev | Pruebas de backend |
| `nodemon` | dev | Recarga automática en desarrollo |

#### Frontend (`frontend/package.json`)

| Paquete | Versión | Uso |
|---|---|---|
| `react` + `react-dom` | ^19.2.4 | Framework UI |
| `react-router-dom` | ^7.13.1 | Enrutamiento SPA |
| `axios` | ^1.13.6 | Cliente HTTP |
| `chart.js` + `react-chartjs-2` | ^4.5.1 / ^5.3.1 | Gráficos interactivos |
| `lucide-react` | ^0.577.0 | Iconografía SVG |
| `typescript` | ~5.9.3 | Tipado estático |
| `vite` | ^8.0.0 | Bundler y servidor de desarrollo |
| `vitest` + `@testing-library/*` | dev | Pruebas de frontend |
| `sharp` | dev | Compresión de imágenes a WebP |
