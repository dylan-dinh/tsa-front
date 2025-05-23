# Use an official Node runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Install security updates and required dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies with security fixes
RUN npm install --legacy-peer-deps && \
    npm audit fix --force && \
    npm install -g npm@latest && \
    npm cache clean --force

# Copy the rest of the frontend code
COPY . .

# Build the app for production
RUN npm run build

# Install a simple server for serving static content
RUN npm install -g serve

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Serve the app
CMD ["serve", "-s", "build", "-l", "3000"]