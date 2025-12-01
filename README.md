
# ⛷️ SkiOffBounds

> La mejor guía para descubrir las mejores estaciones de esquí de Europa. Encuentra tu próxima aventura.

[![Django](https://img.shields.io/badge/Django-5.0+-092E20?style=flat&logo=django)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![CSS Válido](https://img.shields.io/badge/CSS-Válido-1f883d?style=flat&logo=w3c)](https://jigsaw.w3.org/css-validator/)
[![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)](https://github.com/GiovanniPacchetti/SkiOffBounds)

---

## 🌐 Demo en Vivo

**Accede al proyecto desplegado aquí:**  
👉 **[ https://skioffbounds.onrender.com/es/](https://skioffbounds.onrender.com/es/)**

---

## 📖 Acerca del Proyecto

**SkiOffBounds** es una aplicación web desarrollada con Django que permite a los usuarios explorar, filtrar y descubrir estaciones de esquí de toda Europa. Con soporte multiidioma (ES, EN, FR, DE, IT, EU), un diseño totalmente responsive y una interfaz moderna e intuitiva.

### ✨ Características principales

- 🗺️ **Exploración de Destinos**: Navega por estaciones de esquí organizadas por país y región.
- 🎿 **Tipos de Pistas**: Información detallada sobre pistas verdes, azules, rojas y negras.
- 🌍 **Multiidioma**: 6 idiomas disponibles (Español, Inglés, Francés, Alemán, Italiano, Euskera).
- 📱 **100% Responsive**: Diseñado con CSS Grid y Flexbox para cualquier dispositivo.
- ⭐ **Sistema de Favoritos**: Guarda tus estaciones preferidas (JavaScript puro).
- 🔍 **Búsqueda y Filtros**: Encuentra rápidamente lo que necesitas.
- 🎨 **UI/UX**: Diseño elegante con transiciones suaves y animaciones.

---

## 🚀 Instalación y Configuración

### Requisitos previos

- Python 3.10 o superior
- pip (gestor de paquetes de Python)
- SQLite (incluido por defecto en Python)

### 1️⃣ Clonar el repositorio

```
git clone https://github.com/GiovanniPacchetti/SkiOffBounds.git
cd SkiOffBounds
```

### 2️⃣ Crear un entorno virtual (recomendado)

```
python -m venv venv

# Activar en Windows
venv\Scripts\activate

# Activar en Mac/Linux
source venv/bin/activate
```

### 3️⃣ Instalar dependencias

```
pip install -r requirements.txt
```

### 4️⃣ Aplicar migraciones

```
python manage.py migrate
```

### 5️⃣ Cargar datos iniciales (opcional)

Si la base de datos está vacía, puedes cargar datos de ejemplo:

```
python manage.py loaddata datos_iniciales
```

### 6️⃣ Compilar traducciones (multiidioma)

```
python manage.py compilemessages
```

### 7️⃣ Ejecutar el servidor de desarrollo

```
python manage.py runserver
```

La aplicación estará disponible en:
- **Vista de usuario**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Panel de administración**: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)

---

## 📂 Estructura del Proyecto

```
SkiOffBounds/
├── app/                      # Aplicación principal
│   ├── static/              # Archivos estáticos (CSS, JS, imágenes)
│   │   ├── css/            # Hojas de estilo
│   │   ├── js/             # Scripts (favoritos, filtros, búsqueda)
│   │   └── assets/         # Imágenes y recursos
│   ├── templates/          # Plantillas Django
│   ├── models.py           # Modelos de datos
│   ├── views.py            # Lógica de vistas
│   └── urls.py             # Rutas de la app
├── locale/                 # Archivos de traducción (.po/.mo)
├── manage.py              # CLI de Django
├── requirements.txt       # Dependencias Python
└── README.md             # Este archivo
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| **Django 5.0+** | Framework web backend |
| **Python 3.10+** | Lenguaje de programación |
| **SQLite** | Base de datos (desarrollo) |
| **HTML5 + CSS3** | Estructura y estilos |
| **JavaScript (Vanilla)** | Interactividad frontend |
| **Bootstrap Icons** | Iconografía |
| **Django i18n** | Internacionalización |

---

## 🌍 Idiomas Soportados

- 🇪🇸 Español
- 🇬🇧 English
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇮🇹 Italiano
- 🇪🇺 Euskera

---

## 📱 Responsive Design

El proyecto está optimizado para:
- 📱 Móviles (< 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Escritorio (> 1024px)

---