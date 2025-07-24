# TSA Frontend Docker Setup

This directory contains the Docker configuration for the TSA (Twitch Streamer Alerting) frontend application.

## 📱 Platform Support

- **🌐 Web**: Deployed via Docker/Kubernetes (this setup)
- **📱 Mobile**: Native iOS/Android apps (no Kubernetes needed)

## 🐳 Files Overview

- **`Dockerfile`** - Multi-stage build for React Native Expo app
- **`nginx.conf`** - Nginx configuration for serving the web app
- **`.dockerignore`** - Excludes unnecessary files from Docker build
- **`build.sh`** - Convenient build script

## 🚀 Quick Start

### Build the Docker Image

```bash
# Option 1: Use the build script (recommended)
./build.sh

# Option 2: Build manually
docker build -t tsa-frontend:latest .
```

### Run the Container

```bash
# Run on port 3000
docker run -p 3000:80 tsa-frontend:latest

# Run in detached mode
docker run -d -p 3000:80 --name tsa-frontend tsa-frontend:latest
```

### Access the Application

Once running, access your app at: **http://localhost:3000**

## 🏗️ Build Process

The Dockerfile uses a multi-stage build:

1. **Base Stage** - Node.js 18 Alpine base image
2. **Dependencies Stage** - Install production dependencies
3. **Builder Stage** - Install all dependencies and build the Expo web app
4. **Runner Stage** - Nginx Alpine image serving the built app

### 📱 Mobile Development

For mobile development (iOS/Android), use:
```bash
# iOS
npm run ios

# Android  
npm run android

# Expo development server
npm start
```

## 📦 What's Included

- **React Native Expo** app built for web
- **Nginx** web server with optimized configuration
- **Gzip compression** for better performance
- **Security headers** for production use
- **Client-side routing** support
- **Static asset caching** (1 year)
- **Health check endpoint** at `/health`

## 🔧 Configuration

### Nginx Configuration

The `nginx.conf` includes:
- Gzip compression
- Security headers
- Client-side routing support
- Static asset caching
- Health check endpoint

### Environment Variables

The app can be configured with environment variables:
- `NODE_ENV` - Set to `production` for optimized builds
- `EXPO_PUBLIC_API_URL` - Backend API URL

## 🐛 Troubleshooting

### Build Issues

```bash
# Clean build (no cache)
docker build --no-cache -t tsa-frontend:latest .

# Check build logs
docker build -t tsa-frontend:latest . 2>&1 | tee build.log
```

### Runtime Issues

```bash
# Check container logs
docker logs tsa-frontend

# Access container shell
docker exec -it tsa-frontend sh

# Check nginx configuration
docker exec tsa-frontend nginx -t
```

### Health Check

```bash
# Check if the app is running
curl http://localhost:3000/health
```

## 🔄 Integration with Kubernetes

To use this image in your Kubernetes deployment:

1. **Build and push to registry:**
   ```bash
   docker build -t your-registry/tsa-frontend:v1.0.0 .
   docker push your-registry/tsa-frontend:v1.0.0
   ```

2. **Update Helm values.yaml:**
   ```yaml
   frontend:
     image: your-registry/tsa-frontend:v1.0.0
     pullPolicy: Always
   ```

3. **Deploy:**
   ```bash
   helm upgrade tsa-chart ./kubeconfig/tsa-chart --namespace twitch-dev
   ```

## 📝 Notes

- The app is built for **web deployment** using Expo's web export
- **Port 80** is exposed internally (map to your preferred external port)
- **Static assets** are cached for 1 year for better performance
- **Security headers** are configured for production use 