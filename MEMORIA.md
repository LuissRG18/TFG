# MEMORIA DEL PROYECTO — SciLens

**Trabajo de Fin de Grado | Desarrollo de Aplicaciones Web**

---

## 1. INICIACIÓN Y PLANIFICACIÓN DEL PROYECTO

SciLens es una plataforma web de acceso abierto al conocimiento científico cuyo objetivo es centralizar la búsqueda, visualización y gestión de artículos académicos procedentes de múltiples fuentes como **arXiv** y **CrossRef** en una única interfaz moderna e intuitiva.

El sistema permite búsqueda unificada, visualización detallada de artículos, modo de lectura divulgativa, comparación entre artículos, sistema de favoritos con etiquetas y notas, historial de búsquedas, estadísticas personales, exploración por áreas científicas, recomendaciones personalizadas, autenticación con JWT, panel de administración y despliegue con dominio seguro HTTPS.

Quedan fuera del alcance del proyecto la indexación propia de artículos, sistemas de pago, mensajería entre usuarios o generación de contenido científico original.

### 1.2 Análisis de Viabilidad

El proyecto es técnicamente viable utilizando tecnologías modernas ampliamente adoptadas en la industria:

- **Backend:** Node.js + Express
- **Frontend:** React + TypeScript
- **Base de datos:** MongoDB Atlas

Las APIs externas utilizadas (arXiv y CrossRef) son públicas y no requieren autenticación.

La infraestructura utilizada durante el desarrollo se basa completamente en planes gratuitos: Vercel para frontend y backend, MongoDB Atlas M0 para base de datos y APIs académicas públicas.

El desarrollo completo se realizó por un único desarrollador durante aproximadamente 16 semanas con una dedicación estimada de 192 horas de trabajo.

### 1.3 Planificación Temporal

El desarrollo del proyecto se organizó en las siguientes fases:

1. Definición del alcance y análisis
2. Diseño técnico y de base de datos
3. Desarrollo del backend
4. Desarrollo del frontend
5. Integración de sistemas
6. Pruebas y corrección de errores
7. Despliegue en producción
8. Redacción de memoria y preparación de defensa

El diagrama completo se incluye en el Anexo I.

### 1.4 Asignación de Roles

El proyecto ha sido desarrollado por un único estudiante que ha asumido los siguientes roles:

- Analista de requisitos
- Diseñador UI/UX
- Desarrollador Backend
- Desarrollador Frontend
- Administrador de base de datos
- DevOps
- QA Tester
- Redactor de documentación

---

## 2. ANÁLISIS Y DISEÑO

La aplicación sigue una arquitectura cliente-servidor desacoplada.

**Backend:** API REST desarrollada con Node.js y Express siguiendo el patrón MVC. Gestiona autenticación, lógica de negocio y acceso a base de datos mediante Mongoose.

**Frontend:** Aplicación SPA desarrollada con React y TypeScript utilizando Vite como entorno de desarrollo. La comunicación con el backend se realiza mediante Axios.

**Base de datos:** MongoDB Atlas en la nube con modelos definidos mediante Mongoose.

### 2.2 Seguridad

La aplicación implementa diversas medidas de seguridad alineadas con OWASP Top 10:

- **Helmet** para cabeceras HTTP seguras
- **CORS** con lista blanca de dominios autorizados
- **Rate limiting** para prevenir ataques de fuerza bruta (límite estricto de 20 req/15 min en rutas de autenticación; 200 req/15 min en rutas generales)
- **Autenticación basada en JWT**
- **Hash de contraseñas con bcryptjs** (10 rondas)
- **Validación de subida de archivos** (tipo MIME y tamaño máximo 2 MB mediante Multer)
- **Gestión de variables de entorno seguras** (nunca incluidas en el repositorio)

---

## 3. IMPLEMENTACIÓN

El desarrollo se realizó con Visual Studio Code, control de versiones mediante Git y pruebas de endpoints mediante Postman.

El backend se organiza en rutas, controladores, modelos y middleware de autenticación. El frontend utiliza componentes reutilizables, páginas principales, contextos globales de estado (`AuthContext` y `ThemeContext`) y servicios para comunicación con la API.

La integración frontend-backend se realizó mediante pruebas progresivas verificando cada endpoint antes de su integración en la interfaz.

---

## 4. PRUEBAS Y CONTROL DE CALIDAD

Se implementaron pruebas con las siguientes herramientas, diferenciando por capa:

- **Backend:** Jest + Supertest (pruebas unitarias e integración de endpoints)
- **Frontend:** Vitest + Testing Library (pruebas de componentes React)

Las pruebas verificaron:

1. Registro y login de usuarios
2. Protección de rutas privadas
3. Acceso restringido para administradores
4. CRUD completo de favoritos
5. Funcionamiento de tokens JWT
6. Usabilidad en navegadores Chrome, Firefox y Edge

También se realizaron pruebas manuales en diferentes resoluciones de pantalla para garantizar un diseño responsive.

---

## 5. DESPLIEGUE

La aplicación se despliega en la plataforma **Vercel**.

El backend se ejecuta como funciones serverless Node.js y el frontend se publica como aplicación estática con CDN global.

Las variables de entorno necesarias se configuran en el panel de Vercel y no se incluyen en el repositorio.

Cada push al repositorio GitHub desencadena automáticamente un nuevo despliegue gracias al sistema de integración continua.

---

## 6. CONCLUSIONES

SciLens demuestra la aplicación práctica de los conocimientos adquiridos durante el ciclo de Desarrollo de Aplicaciones Web.

La plataforma permite centralizar el acceso a artículos científicos de múltiples fuentes mediante una interfaz moderna, segura y accesible.

Como posibles mejoras futuras se plantean:

- Gamificación del sistema
- Integración de nuevas fuentes académicas como PubMed o IEEE
- Notificaciones de nuevas publicaciones
- Exportación avanzada de bibliografías

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
**Formato:** `application/json`  
**Autenticación:** `Bearer <JWT>`

#### AUTH
> Rate limit: 20 peticiones / 15 minutos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/auth/registro` | Público | Registro de usuario |
| `POST` | `/auth/login` | Público | Login, devuelve JWT |
| `GET` | `/auth/perfil` | Privado (JWT) | Obtener perfil propio |
| `PUT` | `/auth/perfil` | Privado (JWT) | Actualizar nombre y áreas de interés |
| `PUT` | `/auth/cambiar-password` | Privado (JWT) | Cambio de contraseña |
| `POST` | `/auth/avatar` | Privado (JWT) | Subida de avatar (máx. 2 MB, jpg/png/webp/gif) |

#### ARTÍCULOS
> Rate limit general: 200 peticiones / 15 minutos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/articulos/arxiv/buscar` | Público | Buscar en arXiv (`?q=&area=&pagina=&limite=`) |
| `GET` | `/articulos/arxiv/:id` | Público | Obtener artículo arXiv por ID |
| `GET` | `/articulos/crossref/buscar` | Público | Buscar en CrossRef (`?q=&autor=&pagina=&limite=`) |
| `GET` | `/articulos/estadisticas` | Privado (JWT) | Estadísticas personales de favoritos |

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

#### USUARIOS (ADMIN)
> Requieren JWT y rol `admin`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/usuarios/estadisticas` | Estadísticas globales de la plataforma |
| `GET` | `/usuarios` | Listar todos los usuarios |
| `GET` | `/usuarios/:id` | Obtener usuario por ID |
| `PUT` | `/usuarios/:id/estado` | Activar / desactivar usuario |
| `DELETE` | `/usuarios/:id` | Eliminar usuario |

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

---

### Anexo IV — Diseños en Figma

[Ver diseños en Figma](https://www.figma.com/make/yAajNKPnmClmHglNQSjuMB/TFG?p=f&t=XwdBMv7alXbRyy0c-0&fullscreen=1)
