#!/bin/bash

set -eo pipefail

echo "[*] Setting up cluster monitoring..."
echo "[i] Using latest kube-prometheus-stack helm chart."

# helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
# helm repo update

# echo "[*] Installing kube-prometheus-stack helm chart..."

# helm install marketplace-prometheus-stack prometheus-community/kube-prometheus-stack --namespace monitoring

echo "[i] Prometheus Grafana stack applied successfully."

sleep 2

declare -a services=("authentication" "orders" "products" "tenant" "wishlist")

for service in "${services[@]}"; do
    echo "------------------------------------------------"
    echo "[*] Applying ServiceMonitor CRDs for $service..."
    echo "------------------------------------------------"
    if kubectl apply -f "./$service/manifests/servicemonitor"; then
        echo "[i] Sucessfully applied ServiceMonitor for $service."
    else
        echo "[x] Error while applying ServiceMonitor for $service."
    fi
done
