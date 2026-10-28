# SEÑAL — entregables del sitio

Identidad: cemento #F3F1EA / grafito #141310, amarillo seguridad #FFC400, estados ISO 7010, Barlow Condensed + Barlow, claro de día y oscuro de noche automático, cinta de precaución como único adorno.

## 1. Titulares del hero (3 variantes)
- **A (publicada):** Tu operación en campo, con señal clara.
- **B:** Del formato en papel al formulario digital, en minutos.
- **C:** El formulario de seguridad que sí quieren llenar.

El copy completo de cada sección está en las páginas `senal*.html`. B se usa como H1 de `senal-ia.html` y C como H1 de `senal-juego.html`.

## 2. Estructura del sitio
```
index.html            Portada Kairos (hero, nosotros, índice de páginas)
casos.html            Casos de éxito
servicios.html        Servicios + cómo trabajamos + antes/después
productos.html        Plataformas propias (celular interactivo) → enlaza a SEÑAL
ia.html               IA de Kairos
contacto.html         Contacto + FAQ
senal.html            SEÑAL · Hero con demo, confianza, problema, 3 pasos, industrias, CTA
senal-juego.html      Modo Juego / Modo Lite (demo con selector) + 11 tipos de campo
senal-ia.html         Papel → formulario (animación), 3 formas de crear, editor, blueprints
senal-funciones.html  Módulos, pestañas Operario/Administrador/Organización, integraciones
senal-campo.html      Offline, PWA, biometría, evidencia, datos aislados
senal-demo.html       Formulario de demo, planes (se cotizan), FAQ
assets/               kairos.css/js, senal.css/js, site.js (cookies + analítica)
```

## 3. Marcadores pendientes
- `senal.html`: `[COMPLETAR] logos` y `[COMPLETAR] métricas` (barra de confianza).
- Confirmar nombres comerciales de planes (Arranque / Estándar / Escala / Total, tomados de la landing anterior) y la duración del onboarding (2/3/4 meses/a convenir). No hay precios en el sitio.
- Industrias objetivo: lista de 9 tomada del prompt; ajustar al foco comercial real.
- `og-image.png` es la de Kairos; falta una de SEÑAL (1200×630).

## 4. Assets por producir
| Asset | Dónde | Guion |
|---|---|---|
| Captura real del mapa de niveles (móvil) | hero, juego | Pantalla “Ruta de la jornada” con 5 estaciones, sin datos reales de clientes |
| Video corto Modo Juego (15–20 s) | senal-juego | Operario abre la PWA → huella → ruta → responde sí/no → celebración → foto → firma → “Jornada lista” |
| Video/GIF papel → formulario | senal-ia | Foto de un formato real (con permiso) → OCR → campos con tipo → edición en el editor visual |
| Captura del panel admin (aprobación) | funciones | Lista de envíos, detalle con firma, foto, ubicación y hora; botones aprobar/rechazar |
| Captura del editor visual + asistente de chat | ia | Arrastrar un campo; pedir al chat “agrega una foto del anclaje” |
| Logos de clientes/pilotos | senal | Solo con autorización escrita; SVG monocromo |
| OG image SEÑAL | todas | Logo + “Tu operación en campo, con señal clara.” en amarillo #FFC400 sobre grafito #141310, con la cinta de precaución |
| Favicon SEÑAL (opcional) | todas | Marca de ondas (símbolo `s-mark`) en un cuadrado redondeado amarillo #FFC400 |

Las demos del celular, la animación de la IA, el registro de evidencia y los avisos son ilustraciones sintéticas rotuladas como tales; reemplázalas por capturas reales cuando las tengas.
