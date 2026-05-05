#!/bin/bash
set -e


echo "Construyendo product-service..."
docker build --no-cache -t product-service:1.0.0 services/product-service

echo "Construyendo cart-service..."
docker build --no-cache -t cart-service:1.0.0 services/cart-service

echo "Construyendo user-service..."
docker build --no-cache -t user-service:1.0.0 services/user-service

echo "Construyendo mail-service..."
docker build --no-cache -t mail-service:1.0.0 services/mail-service
