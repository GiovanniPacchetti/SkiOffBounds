#!/usr/bin/env bash
# exit on error
set -o errexit

# Instalar dependencias
pip install -r requirements.txt

# Recoger archivos estáticos (CSS, JS)
python manage.py collectstatic --no-input

# Aplicar migraciones
python manage.py migrate

# (OPCIONAL PERO RECOMENDADO) Cargar datos iniciales si la base de datos está vacía
python manage.py loaddata datos_iniciales.json
