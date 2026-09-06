# ----------------------------------------
# 1. BASE STAGE: Shared Environment
# ----------------------------------------
FROM node:24-alpine AS base
WORKDIR /app
# Copy dependency manifests first to optimize layer caching
COPY package*.json ./

# ----------------------------------------
# 2. DEVELOPMENT STAGE: Tools & Hot Reloading
# ----------------------------------------
FROM base AS development
# Install all dependencies (including devDependencies)
RUN npm ci
# Copy the remaining local source code
COPY . .
EXPOSE 4200
# Run the local development server (e.g., nodemon, vite)
CMD ["npm", "run", "start"]