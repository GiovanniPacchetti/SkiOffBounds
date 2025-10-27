from django.contrib import admin
from .models import Localizacion, TipoPista, Estacion, PistaEstacion

# Configuración básica para registrar modelos
admin.site.register(Localizacion)
admin.site.register(TipoPista)
admin.site.register(Estacion)
admin.site.register(PistaEstacion)