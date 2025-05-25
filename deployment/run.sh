#!/bin/bash

set -eo pipefail

echo "[*] Creating namespace..."
kubectl apply -f ./deployment/namespaces.yaml

declare -a services=("authentication" "orders" "products" "tenant" "wishlist")

for service in "${services[@]}"; do
    echo "------------------------------------------------"
    echo "[*] Applying manifests for $service..."
    echo "------------------------------------------------"
    if kubectl apply -f "./$service/manifests/configmap"; then
        echo "[i] Successfully applied ConfigMap for $service."
    else
        echo "[x] Error while applying ConfigMap for $service."
    fi
    if kubectl apply -f "./$service/manifests/secrets"; then
        echo "[i] Successfully applied Secrets for $service."
    else
        echo "[x] Error while applying Secrets for $service."
    fi
    # if kubectl apply -f "./$service/manifests/pv"; then
        # echo "[i] Successfully applied Persistent Volumes & PersistentVolumeClaims for $service."
    # else
        # echo "[x] Error while applying Persistent Volumes & PersistentVolumeClaims for $service."
    # fi
    if kubectl apply -f "./$service/manifests/services/$service.yaml"; then
        echo "[i] Successfully applied Service for $service."
    else
        echo "[x] Error while applying Service for $service."
    fi
done

echo -e "\n[*] All services applied successfully."
