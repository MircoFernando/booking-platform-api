# syntax=docker/dockerfile:1
ARG NODE_VERSION=24.18.0

# --- Stage 1: Build Stage ---
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /usr/src/app

# Copy dependency configs
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install --legacy-peer-deps

# Copy codebase
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the compiled JavaScript application
RUN npm run build


# --- Stage 2: Production Runtime Stage ---
FROM node:${NODE_VERSION}-alpine AS production
WORKDIR /usr/src/app

# Set production env flag
ENV NODE_ENV=production

# Copy configurations and migrations
COPY package*.json ./
COPY prisma.config.ts ./ 
COPY prisma ./prisma/

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy generated Prisma Client and compiled JS artifact from build stage
COPY --from=build /usr/src/app/src/generated/prisma ./src/generated/prisma
COPY --from=build /usr/src/app/dist ./dist

# Expose server port
EXPOSE 3000

# Start compiled NestJS application
CMD [ "node", "dist/src/main" ]