# Desafío Técnico - Desarrollador Web VTEX

## Descripción del Proyecto

Este proyecto consiste en la creación de una aplicación web utilizando JavaScript para realizar consultas de productos mediante un código SKU. La aplicación incluye dos vistas principales:

1. **Interfaz de consulta de productos (PDP)**: Permite al usuario ingresar un código SKU y consultar información básica del producto.
2. **Interfaz de Página de Producto (PDP)**: Muestra los detalles completos del producto seleccionado, como nombre, foto, precio, descripción, y atributos técnicos.

El objetivo es integrar la API de productos de VTEX, realizar búsquedas con un código SKU y presentar los resultados en una interfaz clara y funcional.

## Requerimientos del Desafío

- Realizar una consulta de productos mediante un campo de texto para ingresar el código SKU.
- Mostrar información básica del producto (nombre, categoría, marca, precio) y un botón "Ver Detalle".
- Implementar una página de detalles del producto con información adicional como categoría, marca, precio base, lista de precios, descripción y ficha técnica.
- Resolver problemas de CORS al hacer consultas a la API de VTEX.

## Tecnologías Utilizadas

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js (con Express)
- **API**: VTEX API para la búsqueda de productos
- **Hosting**: Firebase Hosting
- **Despliegue Backend**: Railway para resolver problemas de CORS
- **GitHub**: Repositorio del código fuente

## Pasos Realizados

### 1. **Creación del Backend para Resolver CORS**

Se implementó un servidor backend utilizando **Node.js** y **Express** para manejar las solicitudes de la API de VTEX. El propósito de este backend es solucionar el problema de CORS al realizar consultas desde el frontend.

Se configuró un proxy para que el frontend pudiera realizar solicitudes a la API de VTEX a través del servidor backend sin problemas de CORS.

```javascript
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configuración CORS para permitir solicitudes desde el frontend
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'https://prueba-tecnica-intercorp.web.app'],
  credentials: true,
}));

const targetUrl = 'https://www.promart.pe/api'; 
app.use('/api', createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', 
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Origin', targetUrl);
  }
}));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server escuchando en http://localhost:${PORT}`);
});


```
### 2. **Consultas a la API de VTEX**
Se realizaron consultas a la API de VTEX para obtener los datos de productos utilizando el código SKU ingresado por el usuario. La respuesta de la API incluye información básica del producto (nombre, categoría, marca, precio), que luego se presenta en el frontend.

### 3. **Desarrollo del Frontend**
Se diseñó y estructuró el frontend con dos vistas principales:
- Vista de consulta de productos: Contiene un campo de entrada de texto donde el usuario puede ingresar un código SKU, un botón para realizar la consulta, y un área para mostrar los resultados de búsqueda.
- Vista de página de producto: Muestra los detalles del producto seleccionado, incluyendo nombre, SKU, foto, categoría, marca, precio base, precio de lista, descripción detallada, y ficha técnica.

### 4. **Despliegue en Firebase Hosting**

El frontend de la aplicación fue desplegado en Firebase Hosting para hacer que la aplicación estuviera accesible de manera pública. Se utilizó la CLI de Firebase para realizar el despliegue.