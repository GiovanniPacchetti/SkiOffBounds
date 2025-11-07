from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Localizacion(models.Model):
    """Representa una región geográfica donde hay estaciones de esquí"""
    nombre = models.CharField(
        max_length=100,
        help_text="Ej: Pirineo Catalán, Pirineo Aragonés, Cordillera Cantábrica"
    )
    descripcion = models.TextField(blank=True, null=True)
    # Coordenadas del centro de la región (opcional)
    latitud = models.DecimalField(
        max_digits=9, 
        decimal_places=6,
        blank=True, 
        null=True
    )
    longitud = models.DecimalField(
        max_digits=9, 
        decimal_places=6,
        blank=True, 
        null=True
    )
    
    class Meta:
        verbose_name_plural = "Localizaciones"
    
    def __str__(self):
        return self.nombre


class TipoPista(models.Model):
    """Representa los diferentes tipos de pistas de esquí"""
    COLORES = [
        ('verde', 'Verde - Principiante'),
        ('azul', 'Azul - Fácil'),
        ('roja', 'Roja - Intermedia'),
        ('negra', 'Negra - Difícil'),
    ]
    
    nombre = models.CharField(
        max_length=20,
        choices=COLORES,
        unique=True
    )
    descripcion = models.TextField(
        blank=True, 
        null=True,
        help_text="Características y nivel de dificultad"
    )
    nivel_dificultad = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Nivel de dificultad del 1 (más fácil) al 5 (más difícil)"
    )
    
    class Meta:
        verbose_name = "Tipo de Pista"
        verbose_name_plural = "Tipos de Pista"
        ordering = ['nivel_dificultad']
    
    def __str__(self):
        return self.get_nombre_display()


class Estacion(models.Model):
    """Representa una estación de esquí"""
    # Relación many-to-one: muchas estaciones pueden estar en una localización
    localizacion = models.ForeignKey(
        Localizacion,
        on_delete=models.PROTECT,  # No permitir borrar localización si tiene estaciones
        related_name='estaciones',
        help_text="Región donde se encuentra la estación"
    )
    
    # Relación many-to-many: una estación tiene varios tipos de pista
    tipos_pista = models.ManyToManyField(
        TipoPista,
        through='PistaEstacion',  # Tabla intermedia para almacenar cantidad de pistas
        related_name='estaciones',
        help_text="Tipos de pistas disponibles"
    )
    
    nombre = models.CharField(
        max_length=100,
        unique=True,
        help_text="Ej: Baqueira Beret, Formigal"
    )
    descripcion = models.TextField(blank=True, null=True)
    
    # Coordenadas GPS de la estación
    latitud = models.DecimalField(
        max_digits=9, 
        decimal_places=6,
        help_text="Latitud en formato decimal"
    )
    longitud = models.DecimalField(
        max_digits=9, 
        decimal_places=6,
        help_text="Longitud en formato decimal"
    )
    
    # Datos de la estación
    km_pistas_totales = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Kilómetros totales de pistas"
    )
    altitud_minima = models.IntegerField(
        validators=[MinValueValidator(0)],
        help_text="Altitud mínima en metros"
    )
    altitud_maxima = models.IntegerField(
        validators=[MinValueValidator(0)],
        help_text="Altitud máxima en metros"
    )
    numero_remontes = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Número total de remontes mecánicos"
    )
    
    # Información adicional
    telefono = models.CharField(max_length=20, blank=True, null=True)
    web = models.URLField(blank=True, null=True)
    imagen_portada = models.ImageField(upload_to='portadas/',blank=True, help_text='Imagen Principal', null=True)
    
    # Fechas
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Estación"
        verbose_name_plural = "Estaciones"
        ordering = ['-km_pistas_totales']  # Ordenar por km de pista (mayor a menor)
    
    def __str__(self):
        return f"{self.nombre} ({self.localizacion.nombre})"
    
    def desnivel(self):
        """Calcula el desnivel de la estación"""
        return self.altitud_maxima - self.altitud_minima


class PistaEstacion(models.Model):
    """Tabla intermedia para la relación many-to-many con información adicional"""
    estacion = models.ForeignKey(
        Estacion,
        on_delete=models.CASCADE,  # Si se borra la estación, se borran sus pistas
        related_name='pistas_detalle'
    )
    tipo_pista = models.ForeignKey(
        TipoPista,
        on_delete=models.CASCADE,
        related_name='pistas_detalle'
    )
    
    # Información específica de este tipo de pista en esta estación
    cantidad = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Número de pistas de este tipo"
    )
    km_totales = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Kilómetros totales de este tipo de pista"
    )
    
    class Meta:
        verbose_name = "Pista por Estación"
        verbose_name_plural = "Pistas por Estación"
        unique_together = ['estacion', 'tipo_pista']  # No repetir combinación
        ordering = ['tipo_pista__nivel_dificultad']
    
    def __str__(self):
        return f"{self.estacion.nombre} - {self.tipo_pista.nombre}: {self.cantidad} pistas"
