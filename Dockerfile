# Etapa 1: Construcción de la aplicación Angular
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
