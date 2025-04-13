#!/bin/bash

set -eo pipefail

echo "[*] Creating namespace..."
kubectl apply -f ./deployment/namespaces.yaml

declare -a services=("authentication" "orders" "products" "tenant" "wishlist")

for service in "${services[@]}"; do
    echo "[*] Applying manifests for $service..."
    kubectl apply -f "./$service/manifests/configmap"
    kubectl apply -f "./$service/manifests/secrets"
    kubectl apply -f "./$service/manifests/pv/$service-pvc.yaml"
    kubectl apply -f "./$service/manifests/services"
done

echo "[*] All services applied successfully."
