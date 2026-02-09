# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN ./node_modules/.bin/nx build dashboard --prod

# Serve stage
FROM nginx:alpine
# Angular 17+ usually puts files in /browser, but we handle both cases
COPY --from=builder /app/dist/apps/dashboard/browser /usr/share/nginx/html
# If your version doesn't use the /browser subfolder, use this instead:
# COPY --from=builder /app/dist/apps/dashboard /usr/share/nginx/html

# Copy custom Nginx config for SPA routing
COPY apps/dashboard/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]