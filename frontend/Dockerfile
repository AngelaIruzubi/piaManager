# ---------- Etapa 1: build ----------
# Compila Angular en modo producción (usa environment.ts, con apiUrl = '/api')
FROM node:24-alpine AS build
WORKDIR /app

# Primero solo los package*.json: si no cambian, Docker reutiliza la capa de npm ci
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration production


# ---------- Etapa 2: runtime ----------
# nginx sin privilegios de administrador: escucha en el puerto 8080
FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime

# Parches de seguridad del sistema operativo (Alpine) publicados después de la imagen base.
# Hace falta ser root solo para esto; enseguida se vuelve al usuario sin privilegios de nginx (101)
USER root
RUN apk upgrade --no-cache
USER 101

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Del "taller" solo nos llevamos los archivos compilados (index.html, .js, .css...)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 8080

# 127.0.0.1 y no localhost: dentro del contenedor localhost resuelve primero a IPv6 (::1) y nginx escucha en IPv4
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
