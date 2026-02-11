import axios from 'axios';

// --- CAMBIO IMPORTANTE ---
// 1. Intentamos leer la URL desde la configuración global (public/config.js)
// 2. Si no existe, usamos tu IP de AWS fija como respaldo.
// Así nunca fallará ni en local ni en producción.
const URL_BACKEND = window.__APP_CONFIG__?.API_URL || 'http://34.205.99.251:3000/api';

/**
 * Instancia configurada de Axios
 */
const api = axios.create({
  baseURL: URL_BACKEND, // Usamos la variable inteligente
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let respuestaError = {
      ok: false,
      datos: null,
      mensaje: 'Error desconocido',
    };

    if (error.response) {
      respuestaError.mensaje = error.response.data?.mensaje || 
                             `Error: ${error.response.status} ${error.response.statusText}`;
      
      if (error.response.status === 404) {
        console.warn(`Recurso no encontrado: ${error.config.url}`);
      } else if (error.response.status === 400) {
        console.warn(`Solicitud inválida: ${error.config.url}`);
      } else if (error.response.status >= 500) {
        console.error(`Error del servidor: ${error.config.url} - Status: ${error.response.status}`);
      }
    } else if (error.request) {
      respuestaError.mensaje = 'No hay respuesta del servidor. Verifica tu conexión.';
      console.error('No hay respuesta del servidor:', error.request);
    } else {
      respuestaError.mensaje = error.message || 'Error al realizar la solicitud';
      console.error('Error en la solicitud:', error.message);
    }

    return Promise.reject(respuestaError);
  }
);

// Solo si quiero volver a trabajar 100% local
// window.__APP_CONFIG__ = {
//     API_URL: "http://localhost:3000/api"
// };

export default api;

