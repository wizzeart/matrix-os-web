#!/bin/bash
MSG=${1:-"Auto commit: Actualizacion de modulos Matrix OS"}
git add .
git commit -m "$MSG"
git push origin main
echo "=================================================="
echo "SYNCHRONIZATION WITH THE MOTHERBOARD COMPLETE."
