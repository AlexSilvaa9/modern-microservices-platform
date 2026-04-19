#!/bin/bash


echo "Aplicando los manifiestos de Kubernetes..."
./docker-build.sh
kubectl delete -f k8s/
kubectl apply -f k8s/

kubectl delete -f k8s/RBAC
kubectl apply -f k8s/RBAC/

kubectl delete deploy cart-service-devspace
kubectl delete deploy user-service-devspace
kubectl delete deploy catalog-service-devspace
echo "¡Despliegue finalizado! Usa 'kubectl get pods' para ver su estado."