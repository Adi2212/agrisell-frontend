# ==========================================
# Build Stage (Node.js)
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy source code
COPY . .

# Build-time environment variables for Vite
ARG VITE_BASE_URL=http://localhost:9090
ARG VITE_GOOGLE_CLIENT_ID=43044073958-nv3o5nn61mphg55dqunv5vcanh7jroql.apps.googleusercontent.com

ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Compile Vite React application
RUN npm run build

# ==========================================
# Runtime Stage (Nginx Alpine)
# ==========================================
FROM nginx:alpine

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled production bundle
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with React Router SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose web server port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
