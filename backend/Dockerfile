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
# 1. Parches de seguridad del sistema operativo (Alpine) publicados después de la imagen base
# 2. Solo dependencias de producción
# 3. Quitar los gestores de paquetes (npm, npx, corepack, yarn): la app arranca con "node" y no los
#    necesita. Son como los andamios: se retiran al terminar, y con ellos sus vulnerabilidades
RUN apk upgrade --no-cache \
 && npm ci --omit=dev \
 && npm cache clean --force \
 && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
           /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
           /usr/local/bin/yarn /usr/local/bin/yarnpkg

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
