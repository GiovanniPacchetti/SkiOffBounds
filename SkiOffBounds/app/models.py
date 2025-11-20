from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _  # ← IMPORTANTE

class Localizacion(models.Model):
    """Representa una región geográfica donde hay estaciones de esquí"""
    nombre = models.CharField(
        max_length=100,
        help_text=_("Ej: Pirineo Catalán, Pirineo Aragonés, Cordillera Cantábrica")
    )
    descripcion = models.TextField(blank=True, null=True, verbose_name=_("Descripción"))
    
    # Coordenadas del centro de la región (opcional)
    latitud = models.DecimalField(
        max_digits=9, 
        decimal_places=6,
        blank=True, 
        null=True,
        verbose_name=_("Latitud")
    )
    longitud = models.DecimalField(
        max_digits=9, 
        decimal_places=6,
        blank=True, 
        null=True,
        verbose_name=_("Longitud")
    )
    
    class Meta:
        verbose_name = _("Localización")
        verbose_name_plural = _("Localizaciones")
    
    def __str__(self):
        return self.nombre


class TipoPista(models.Model):
    """Representa los diferentes tipos de pistas de esquí"""
    COLORES = [
        ('verde', _('Verde - Principiante')),
        ('azul', _('Azul - Fácil')),
        ('roja', _('Roja - Intermedia')),
        ('negra', _('Negra - Difícil')),
    ]
    
    nombre = models.CharField(
        max_length=20,
        choices=COLORES,
        unique=True,
        verbose_name=_("Color / Tipo")
    )
    descripcion = models.TextField(
        blank=True, 
        null=True,
        help_text=_("Características y nivel de dificultad"),
        verbose_name=_("Descripción")
    )
    nivel_dificultad = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text=_("Nivel de dificultad del 1 (más fácil) al 5 (más difícil)"),
        verbose_name=_("Nivel de dificultad")
    )
    
    class Meta:
        verbose_name = _("Tipo de Pista")
        verbose_name_plural = _("Tipos de Pista")
        ordering = ['nivel_dificultad']
    
    def __str__(self):
        return self.get_nombre_display()


class Estacion(models.Model):
    """Representa una estación de esquí"""
    localizacion = models.ForeignKey(
        Localizacion,
        on_delete=models.PROTECT,
        related_name='estaciones',
        help_text=_("Región donde se encuentra la estación"),
        verbose_name=_("Localización")
    )
    
    tipos_pista = models.ManyToManyField(
        TipoPista,
        through='PistaEstacion',
        related_name='estaciones',
        help_text=_("Tipos de pistas disponibles"),
        verbose_name=_("Tipos de pista")
    )
    
    nombre = models.CharField(
        max_length=100,
        unique=True,
        help_text=_("Ej: Baqueira Beret, Formigal"),
        verbose_name=_("Nombre")
    )
    descripcion = models.TextField(blank=True, null=True, verbose_name=_("Descripción"))
    
    latitud = models.DecimalField(
        max_digits=9, 
        decimal_places=6,
        help_text=_("Latitud en formato decimal"),
        verbose_name=_("Latitud")
    )
    longitud = models.DecimalField(
        max_digits=9, 
        decimal_places=6,
        help_text=_("Longitud en formato decimal"),
        verbose_name=_("Longitud")
    )
    
    # Datos de la estación
    km_pistas_totales = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text=_("Kilómetros totales de pistas"),
        verbose_name=_("Km de pistas totales")
    )
    altitud_minima = models.IntegerField(
        validators=[MinValueValidator(0)],
        help_text=_("Altitud mínima en metros"),
        verbose_name=_("Altitud mínima")
    )
    altitud_maxima = models.IntegerField(
        validators=[MinValueValidator(0)],
        help_text=_("Altitud máxima en metros"),
        verbose_name=_("Altitud máxima")
    )
    numero_remontes = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text=_("Número total de remontes mecánicos"),
        verbose_name=_("Número de remontes")
    )
    
    # Información adicional
    telefono = models.CharField(max_length=20, blank=True, null=True, verbose_name=_("Teléfono"))
    web = models.URLField(blank=True, null=True, verbose_name=_("Sitio Web"))
    imagen_portada = models.ImageField(
        upload_to='portadas/',
        blank=True, 
        help_text=_('Imagen Principal'), 
        null=True,
        verbose_name=_("Imagen de portada")
    )
    
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name=_("Fecha de creación"))
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name=_("Última actualización"))
    
    class Meta:
        verbose_name = _("Estación")
        verbose_name_plural = _("Estaciones")
        ordering = ['-km_pistas_totales']
    
    def __str__(self):
        return f"{self.nombre} ({self.localizacion.nombre})"
    
    def desnivel(self):
        return self.altitud_maxima - self.altitud_minima


class PistaEstacion(models.Model):
    """Tabla intermedia para la relación many-to-many con información adicional"""
    estacion = models.ForeignKey(
        Estacion,
        on_delete=models.CASCADE,
        related_name='pistas_detalle',
        verbose_name=_("Estación")
    )
    tipo_pista = models.ForeignKey(
        TipoPista,
        on_delete=models.CASCADE,
        related_name='pistas_detalle',
        verbose_name=_("Tipo de pista")
    )
    
    cantidad = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text=_("Número de pistas de este tipo"),
        verbose_name=_("Cantidad")
    )
    km_totales = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text=_("Kilómetros totales de este tipo de pista"),
        verbose_name=_("Km totales")
    )
    
    class Meta:
        verbose_name = _("Pista por Estación")
        verbose_name_plural = _("Pistas por Estación")
        unique_together = ['estacion', 'tipo_pista']
        ordering = ['tipo_pista__nivel_dificultad']
    
    def __str__(self):
        return f"{self.estacion.nombre} - {self.tipo_pista.nombre}: {self.cantidad} pistas"
