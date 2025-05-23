# Use an official Node runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with security fixes
RUN npm install --legacy-peer-deps && \
    npm audit fix --force && \
    npm install execa@7.1.1 --save-exact

# Copy the rest of the frontend code
COPY . .

# Build the app for production
RUN npm run build

# Install a simple server for serving static content
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Serve the app
CMD ["serve", "-s", "build", "-l", "3000"]