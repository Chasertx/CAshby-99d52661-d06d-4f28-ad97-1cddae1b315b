# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
# Use --legacy-peer-deps if you hit dependency conflicts
RUN npm install
COPY . .
RUN ./node_modules/.bin/nx build api --prod

# Production stage
FROM node:20-slim
WORKDIR /app

# Install essentials for native modules
RUN apt-get update && apt-get install -y python3 make g++ sqlite3 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist/apps/api .
COPY --from=builder /app/node_modules ./node_modules

# Re-build sqlite3 inside the container
RUN npm rebuild sqlite3

# Permissions for the SQLite file
RUN mkdir -p /app/database && chmod 777 /app/database

# Just a quick check log
RUN echo "API container built and sqlite3 ready."
CMD ["node", "main.js"]