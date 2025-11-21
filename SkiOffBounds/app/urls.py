from django.urls import path
from . import views

app_name = 'skioffbounds'  # Namespace actualizado

urlpatterns = [
    # URLs para Estaciones
    path('', views.index_estaciones, name='index'),
    
    path('estaciones/todas/', views.lista_todas_estaciones, name='estaciones_todas'),
    
    path('estaciones/<int:estacion_id>/', views.show_estacion, name='estacion_detalle'),
    path('estaciones/<int:estacion_id>/pistas/', views.index_pistas_por_estacion, name='estacion_pistas'),
    path('api/estacion/<int:estacion_id>/estado/', views.api_estado_estacion, name='api_estado'),

    # URLs para Localizaciones
    path('localizaciones/', views.index_localizaciones, name='localizaciones'),
    path('localizaciones/<int:localizacion_id>/', views.show_localizacion, name='localizacion_detalle'),
    path('localizaciones/<int:localizacion_id>/estaciones/', views.index_estaciones_por_localizacion, name='localizacion_estaciones'),
    
    # URLs para Tipos de Pista
    path('tipos-pista/', views.index_tipos_pista, name='tipos_pista'),
    path('tipos-pista/<int:tipo_pista_id>/', views.show_tipo_pista, name='tipo_pista_detalle'),
    path('tipos-pista/<int:tipo_pista_id>/estaciones/', views.index_estaciones_por_tipo_pista, name='estaciones_por_tipo_pista'),

    # Nuevas APIs AJAX
    path('api/search/', views.search_estaciones_api, name='api_search'),
    path('api/filter/', views.filtrar_estaciones_api, name='api_filter'),
]
