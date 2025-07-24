# Multi-stage build for React Native Expo app
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install all dependencies (including dev dependencies)
RUN npm ci

# Build the app for web
RUN npx expo export --platform web

# Production image, copy all the files and run the app
FROM nginx:alpine AS runner
WORKDIR /app

# Copy the built app from the builder stage
# Expo export creates a 'dist' directory for web builds
COPY --from=builder /app/dist ./dist

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 