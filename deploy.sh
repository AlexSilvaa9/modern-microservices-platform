#!/bin/bash
set -e

echo "Iniciando el despliegue de los microservicios..."

echo "1. Configurando entorno Docker para usar el daemon de Minikube..."
eval $(minikube docker-env)

echo "2. Compilando los proyectos con Maven..."
mvn clean package -Dmaven.test.skip=true

echo "3. Construyendo las imágenes de Docker dentro de Minikube..."

echo "Construyendo catalog-service..."
docker build -t catalog-service:latest services/catalog-service

echo "Construyendo cart-service..."
docker build -t cart-service:latest services/cart-service

echo "Construyendo user-service..."
docker build -t user-service:latest services/user-service

echo "4. Aplicando los manifiestos de Kubernetes..."
kubectl apply -f k8s/

echo "5. Reiniciando los despliegues para forzar la actualización de la imagen..."
kubectl rollout restart deployment/catalog-service
kubectl rollout restart deployment/cart-service
kubectl rollout restart deployment/user-service

echo "¡Despliegue finalizado! Usa 'kubectl get pods' para ver su estado."