from django.shortcuts import get_object_or_404, get_list_or_404, render
from .models import Localizacion, TipoPista, Estacion, PistaEstacion
from django.db.models import Max
from django.http import JsonResponse
from django.db.models import Q
from django.urls import reverse
from django.utils.translation import gettext as _ 



def index_estaciones(request):
    """
    Muestra la estación con más km de pistas de cada localización
    """
    localizaciones = Localizacion.objects.all()
    estaciones_destacadas = []
    
    for loc in localizaciones:
        # Obtener la estación con más km de pistas de esta localización
        estacion = loc.estaciones.order_by('-km_pistas_totales').first()
        if estacion:
            estaciones_destacadas.append(estacion)
    
    # IMPORTANTE: Pasar AMBAS variables al contexto
    context = {
        'lista_estaciones': estaciones_destacadas,
        'localizaciones': localizaciones,  # ← AÑADIR ESTA LÍNEA
    }
    return render(request, 'index.html', context)


def lista_todas_estaciones(request):
    """
    Muestra TODAS las estaciones (no solo destacadas)
    """
    estaciones = get_list_or_404(Estacion.objects.order_by('-km_pistas_totales'))
    context = {'lista_estaciones': estaciones}
    return render(request, 'estaciones_todas.html', context)

# Devuelve el listado de localizaciones
def index_localizaciones(request):
    localizaciones = get_list_or_404(Localizacion.objects.order_by('nombre'))
    context = {'lista_localizaciones': localizaciones}
    return render(request, 'localizaciones.html', context)


# Devuelve los detalles de una localización
def show_localizacion(request, localizacion_id):
    localizacion = get_object_or_404(Localizacion, pk=localizacion_id)
    context = {'localizacion': localizacion}
    return render(request, 'localizacion_detail.html', context)


# Devuelve las estaciones de una localización
def index_estaciones_por_localizacion(request, localizacion_id):
    localizacion = get_object_or_404(Localizacion, pk=localizacion_id)
    estaciones = localizacion.estaciones.all()
    context = {'localizacion': localizacion, 'estaciones': estaciones}
    return render(request, 'estaciones_por_localizacion.html', context)


# Devuelve los detalles de una estación
def show_estacion(request, estacion_id):
    estacion = get_object_or_404(Estacion, pk=estacion_id)
    context = {'estacion': estacion}
    return render(request, 'estacion_detail.html', context)


# Devuelve las pistas de una estación
def index_pistas_por_estacion(request, estacion_id):
    estacion = get_object_or_404(Estacion, pk=estacion_id)
    pistas = estacion.pistas_detalle.all()
    context = {'estacion': estacion, 'pistas': pistas}
    return render(request, 'pistas_estacion.html', context)


# Devuelve el listado de tipos de pista
def index_tipos_pista(request):
    tipos = get_list_or_404(TipoPista.objects.order_by('nivel_dificultad'))
    context = {'lista_tipos': tipos}
    return render(request, 'tipos_pista.html', context)


# Devuelve los detalles de un tipo de pista
def show_tipo_pista(request, tipo_pista_id):
    tipo = get_object_or_404(TipoPista, pk=tipo_pista_id)
    estaciones = tipo.estaciones.all()
    context = {'tipo_pista': tipo, 'estaciones': estaciones}
    return render(request, 'tipo_pista_detail.html', context)


# Devuelve las estaciones que tienen un tipo de pista específico
def index_estaciones_por_tipo_pista(request, tipo_pista_id):
    tipo = get_object_or_404(TipoPista, pk=tipo_pista_id)
    estaciones = tipo.estaciones.all()
    context = {'tipo_pista': tipo, 'estaciones': estaciones}
    return render(request, 'estaciones_por_tipo.html', context)


def search_estaciones_api(request):
    """API endpoint para búsqueda en tiempo real de estaciones"""
    query = request.GET.get('q', '').strip()
    
    if len(query) < 2:
        return JsonResponse([], safe=False)
    
    # Buscar en nombre de estación y localización
    estaciones = Estacion.objects.filter(
        Q(nombre__icontains=query) | 
        Q(localizacion__nombre__icontains=query)
    ).select_related('localizacion')[:8]
    
    data = [{
        'id': e.id,
        'nombre': e.nombre,
        'localizacion': e.localizacion.nombre,
        'km_pistas': e.km_pistas_totales,
        'altitud_max': e.altitud_maxima,
        'url': f'/home/estaciones/{e.id}/'
    } for e in estaciones]
    
    return JsonResponse(data, safe=False)


def filtrar_estaciones_api(request):
    """API endpoint para filtrar estaciones por localización"""
    localizacion_id = request.GET.get('loc', '')
    
    if localizacion_id:
        estaciones = Estacion.objects.filter(
            localizacion_id=localizacion_id
        ).select_related('localizacion')
    else:
        estaciones = Estacion.objects.all().select_related('localizacion')
    
    data = [{
        'id': e.id,
        'nombre': e.nombre,
        'localizacion': e.localizacion.nombre,
        'km_pistas': e.km_pistas_totales,
        'url': f'/home/estaciones/{e.id}/'
    } for e in estaciones]
    
    return JsonResponse(data, safe=False)
