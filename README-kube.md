### Publishing image

docker build -t tsa-frontend:v0.0.5 . -> (tag)
docker tag tsa-frontend:v0.0.5 (tag) aledmaman/tsa-frontend:v0.0.5 -> (tag)
docker push aledmaman/tsa-frontend:v0.0.5 -> (tag)

docker run -p 8080:8080 bdrr/tsa-backend:v0.0.5
connect back to front login step