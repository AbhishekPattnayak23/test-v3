# Backend Dockerfile
# Multi-stage build for Node.js + TypeScript application

FROM node:18-alpine AS base

# Install dependencies for build
RUN apk add --no-cache git python3 make g++

WORKDIR /app

# Stage 1: Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Build TypeScript
FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Production image
FROM base AS production
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Copy built application
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/.env ./.

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

# Entrypoint
ENTRYPOINT ["node", "dist/src/index.js"]
