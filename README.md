# My Store

**Where buying and selling is easy**

Tienda en línea en HTML, CSS y JavaScript (vanilla). Catálogo de productos cargado desde JSON, carrito de compras, paneles de pedidos y mensajes, y formularios con validación. Arquitectura **MVC** en módulos ES.

---

## Características

### Estructura HTML
- Marcas semánticas HTML5 (`header`, `nav`, `main`, `article`, `aside`, `section`, `footer`)
- Navegación interna con anclas (`#catalog`, `#cart`, etc.)
- Catálogo generado desde `data/products.json`
- Lista de más vendidos, categorías, planes de garantía e indicadores (rating / stock)
- Formulario de compra (envío) y formulario de contacto

### Estilos (CSS)
- Variables en `:root` (colores, radios, sombras)
- Flexbox y Grid; barra lateral fija; estilos por sección (`#catalog`, `#cart`, …)
- Clase utilitaria `.is-hidden` para mostrar u ocultar bloques (p. ej. carrito vacío vs. checkout)

### Lógica (JavaScript, ES modules)
- **`model.js`**: datos y reglas — catálogo, carrito, pedidos, mensajes
- **`view.js`**: renderizado en el DOM y notificaciones tipo toast
- **`controller.js`**: enlace de eventos (clicks, envíos de formularios)
- **`formValidation.js`**: validación de nombres y normalización de teléfono (solo dígitos) antes del envío
- **`app.js`**: entrada; importa el controlador e inicia la app tras `DOMContentLoaded`

Los datos del catálogo se obtienen con `fetch("./data/products.json")`. **El sitio debe servirse por HTTP** (no abrir `index.html` como `file://`), para que funcionen los módulos y la petición al JSON.

---

## Estructura del proyecto

```
Store/
├── index.html          # Página principal (script type="module" → app.js)
├── app.js              # Punto de entrada
├── model.js            # Modelo
├── view.js             # Vista
├── controller.js       # Controlador
├── formValidation.js   # Validación de formularios
├── styles.css
├── data/
│   └── products.json   # Productos, categorías, planes, más vendidos
├── images/             # Logo, imágenes de productos, ícono de carrito
└── README.md
```

---

## Cómo ejecutar en local

1. Clona o descarga el repositorio.
2. Asegúrate de tener la carpeta `images/` y `data/products.json`.
3. Sirve la raíz del proyecto con un servidor HTTP, por ejemplo:
   - **VS Code / Cursor:** extensión “Live Server” (abrir con Live Server).
   - **Node:** `npx serve .` o `npx http-server .`
   - **Python:** `python -m http.server 8080` (desde la carpeta del proyecto)

4. Abre la URL que indique el servidor (p. ej. `http://127.0.0.1:5500`).

Sin servidor, el navegador puede bloquear módulos o `fetch` al abrir el archivo directamente.

---

## Validación de formularios (resumen)

- Nombres y apellidos: mínimo 3 caracteres, máximo 80; no solo dígitos
- Teléfono: solo números, entre 7 y 15 dígitos (se eliminan caracteres no numéricos al enviar)
- Email, dirección y mensaje de contacto según atributos y reglas en `index.html` y `formValidation.js`

---

## Catálogo de ejemplo (referencia)

| Product    | Brand    | Price |
|------------|----------|-------|
| PC         | Dell     | $500  |
| Smartphone | Apple    | $200  |
| Laptop     | Dell     | $300  |
| Tablet     | Apple    | $400  |
| Smartwatch | Apple    | $500  |
| Mouse      | Logitech | $50   |
| Keyboard   | Apple    | $100  |
| Monitor    | Apple    | $100  |

Los artículos reales dependen de `data/products.json`.

---

## Secciones de la página

| Sección               | Descripción                                      |
|-----------------------|--------------------------------------------------|
| Home                  | Bienvenida                                       |
| Catalog               | Catálogo de productos                            |
| Specifications        | Especificaciones del sitio                       |
| Best Selling Products | Productos destacados                             |
| Categories            | Enlaces por categoría                            |
| Indicators            | Satisfacción y stock                             |
| Store                 | Área de tienda / pedidos en tabla                |
| Warranty plans        | Planes de garantía                               |
| My Account            | Cuenta de usuario (placeholder)                  |
| Cart                  | Carrito y checkout                               |
| Contact               | Formulario de contacto                           |

---

## Tecnologías

- HTML5, CSS3
- JavaScript (módulos ES, sin frameworks)

---

## Contacto (proyecto)

- **Email:** santyvano@outlook.com
- **Teléfono:** 3127163848
- **Dirección:** Calle 25 # 30-28, Medellín, Colombia

---

© 2026 My Store. All rights reserved.
