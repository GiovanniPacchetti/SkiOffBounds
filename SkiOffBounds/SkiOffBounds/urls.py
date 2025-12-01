"""
URL configuration for SkiOffBounds project.
"""
from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView
from django.conf.urls.static import static
from django.conf import settings
from django.views.i18n import JavaScriptCatalog
from django.conf.urls.i18n import i18n_patterns

# 1. URLs globales que no necesitan prefijo de idioma
urlpatterns = [
    path('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),
    # ESTA ES LA LÍNEA QUE FALTABA:
    path('i18n/', include('django.conf.urls.i18n')), 
]

# 2. URLs que soportan prefijo de idioma (/es/, /en/)
urlpatterns += i18n_patterns(
    path('', include('app.urls')),
    path('admin/', admin.site.urls),
    path('', RedirectView.as_view(url='', permanent=False)),
)

# 3. Archivos Media
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
