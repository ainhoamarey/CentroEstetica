Descripción

Sitio web profesional para un centro de estética especializado en maquillaje, peluquería y tratamientos de belleza.
Incluye galería de trabajos y formulario de contacto seguro y optimizado.

Funcionalidades

HTML semántico y accesible (etiquetas modernas, ARIA, SEO).

Diseño responsive (adaptado a móvil, tablet y escritorio).

Galería de imágenes con carga rápida y efectos.

Formulario de contacto seguro con validación y protección anti-spam.

Optimización de rendimiento (lazy loading, preload de recursos, CSS modular).

Medidas de seguridad contra XSS, inyecciones SQL y ataques comunes.

Estructura
Centro Estética/
├── README.md
├── estetica.html        # Página principal
├── contacto.html        # Página de contacto
├── estetica.css         # Estilos generales
├── contacto.css         # Estilos del formulario
├── estetica.php         # Procesador seguro del formulario
├── imagenes/            # Galería y logotipo
└── icomoon/             # Iconos opcionales

Instalación

Requisitos: servidor web con PHP 7.4+ y MySQL/MariaDB.

Crear base de datos:

CREATE DATABASE estetica CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE estetica;
CREATE TABLE estetica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    mensaje TEXT,
    privacidad TINYINT(1) NOT NULL DEFAULT 1,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_origen VARCHAR(45)
);


Configurar credenciales en estetica.php:

class DatabaseConfig {
    const HOST = 'tu_host';
    const USERNAME = 'tu_usuario';
    const PASSWORD = 'tu_password';
    const DATABASE = 'estetica';
}


Ajustar permisos de archivos:

chmod 644 *.html *.css *.md
chmod 600 estetica.php
chmod 755 imagenes/