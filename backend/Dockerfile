# ---------- Etapa 1: build ----------
# Instala todas las dependencias (también las de desarrollo) y compila TypeScript a JavaScript
FROM node:24-alpine AS build
WORKDIR /app

# Primero solo los package*.json: si no cambian, Docker reutiliza la capa de npm ci (builds más rápidos)
COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build


# ---------- Etapa 2: runtime ----------
# Imagen final: solo dependencias de producción y el código compilado
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Del "taller" solo nos llevamos el resultado compilado
COPY --from=build /app/dist ./dist

# Sin permisos de administrador dentro del contenedor
USER node

EXPOSE 3000

# Docker comprueba cada 30 s que la API responde (lo usará docker compose para el orden de arranque)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Al arrancar, el backend aplica las migraciones pendientes y se pone a escuchar
CMD ["node", "dist/index.js"]
