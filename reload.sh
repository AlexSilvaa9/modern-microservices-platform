#!/bin/bash
set -e

echo "Configurando entorno Docker para usar el daemon de Minikube..."
eval $(minikube docker-env)

echo "Aplicando los manifiestos de Kubernetes..."
kubectl apply -f k8s/

echo "Reiniciando los despliegues para forzar la actualización de la imagen..."
kubectl rollout restart deployment/catalog-service
kubectl rollout restart deployment/cart-service
kubectl rollout restart deployment/user-service

echo "¡Despliegue finalizado! Usa 'kubectl get pods' para ver su estado."