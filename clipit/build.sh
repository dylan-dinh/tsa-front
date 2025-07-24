#!/bin/bash

# Build script for TSA Frontend Docker image

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Building TSA Frontend Docker Image${NC}"

# Build the Docker image
echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker build -t tsa-frontend:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully!${NC}"
    
    echo -e "${YELLOW}🐳 Image details:${NC}"
    docker images tsa-frontend:latest
    
    echo -e "${GREEN}🎯 To run the container:${NC}"
    echo "docker run -p 3000:80 tsa-frontend:latest"
    echo ""
    echo -e "${GREEN}🌐 Then access your app at: http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Docker build failed!${NC}"
    exit 1
fi 