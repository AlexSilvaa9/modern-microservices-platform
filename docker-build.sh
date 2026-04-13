#!/bin/bash
set -e


echo "Construyendo catalog-service..."
docker build --no-cache -t catalog-service:1.0.0 services/catalog-service

echo "Construyendo cart-service..."
docker build --no-cache -t cart-service:1.0.0 services/cart-service

echo "Construyendo user-service..."
docker build --no-cache -t user-service:1.0.0 services/user-service
