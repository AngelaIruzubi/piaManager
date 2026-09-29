# piaManager

Aplicación web full stack para gestionar **Planes de Atención Individualizada (PAI)** en centros sociales y educativos.

Nace de mi experiencia de cinco años como educadora social: en los centros, los PAI suelen gestionarse en documentos sueltos y hojas de cálculo. piaManager centraliza en un solo lugar las personas usuarias, sus planes, objetivos y el seguimiento diario del equipo educativo.

> 🚧 Proyecto en desarrollo activo.

## Funcionalidades

- **Autenticación con JWT** y contraseñas cifradas con bcrypt.
- **Control de acceso por roles**: coordinación y educadores, con permisos distintos en backend (middlewares) y frontend (guards).
- **Personas usuarias**: alta, edición, ficha individual y baja.
- **PAI por persona**: creación, edición y cambio de estado del plan.
- **Objetivos por área** y **medios** para alcanzarlos.
- **Seguimientos** del progreso de cada objetivo.
- **Asignación de educadores** a cada persona usuaria.
- **Gestión de usuarios** del equipo (solo coordinación).

## Tecnologías

| Parte | Stack |
|---|---|
| Frontend | Angular 21, TypeScript, SCSS, interceptor JWT, guards de rutas |
| Backend | Node.js, Express 5, TypeScript, TypeORM, class-validator (DTOs) |
| Base de datos | PostgreSQL 16 en Docker (Docker Compose) |
| Testing | Jest, ts-jest y Supertest |
| CI | GitHub Actions: los tests del backend se ejecutan en cada push y pull request |

## Arquitectura del backend

API REST organizada por capas:

```
backend/src
├── routes/        # Definición de endpoints
├── controllers/   # Gestión de peticiones y respuestas
├── services/      # Lógica de negocio
├── entities/      # Modelos de TypeORM
├── dtos/          # Validación de datos de entrada
├── middlewares/   # Autenticación y roles
└── tests/         # Tests unitarios de los servicios
```

Principales endpoints: `/api/auth`, `/api/personas`, `/api/pai`, `/api/objetivos`, `/api/medios`, `/api/seguimientos`, `/api/asignaciones`, `/api/usuarios`.

## Puesta en marcha

Requisitos: Node.js 20+, Docker y Angular CLI.

```bash
# 1. Clonar el repositorio
git clone https://github.com/AngelaIruzubi/piaManager.git
cd piaManager

# 2. Levantar la base de datos
docker compose up -d

# 3. Backend
cd backend
cp .env.example .env
npm install
npm run seed     # carga catálogos y crea la coordinadora inicial
npm run dev      # http://localhost:3000

# 4. Frontend (en otra terminal)
cd frontend
npm install
ng serve         # http://localhost:4200
```

**Usuario de prueba** (creado por el seed): `admin@pia.com` / `admin123`

## Tests

```bash
cd backend
npm test               # ejecuta los tests
npm run test:coverage  # informe de cobertura
```

## Próximos pasos

- Despliegue completo de la aplicación con Docker.
- Informes de evolución por persona usuaria.

## Autora

**Ángela Iruzubieta** · [LinkedIn](https://linkedin.com/in/angela-iruzubieta) · [GitHub](https://github.com/AngelaIruzubi)
