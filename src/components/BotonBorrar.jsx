/**
 * Botón reutilizable para eliminar un recurso mediante una petición DELETE.
 * Utiliza el API configurado y recarga la página tras eliminar.
 * @module BotonBorrar
 * @param {Object} props
 * @param {string} props.ruta - Ruta base de la API para eliminar.
 * @param {number|string} props.id - ID del recurso a eliminar.
 */
import api from "../api";
import { useState } from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
// Aquí uso axios para hacer la petición DELETE

function BotonBorrar({ ruta, id }) {
  /**
   * Estado para almacenar errores de la petición DELETE.
   * @type {string|null}
   */
  const [error, setError] = useState(null);
  /**
   * Estado para almacenar los datos tras eliminar (no se usa en el render actual).
   * @type {Array}
   */
  const [datos, setDatos] = useState([]);

  /**
   * Maneja la petición DELETE y recarga la página al finalizar.
   * @async
   * @param {number|string} id - ID del recurso a eliminar.
   */
  async function handleDelete(id) {
    try {
      await api.delete(ruta + id);

      const datos_nuevos = datos.filter((dato) => dato.id != id);

      // Actualizamos los datos
      setDatos(datos_nuevos);

      // Ya no tenemos errores
      setError(null);
      window.location.reload();
    } catch (error) {
      setError(error.mensaje || "No se pudo conectar al servidor");
      setDatos([]);
    }
  }

  // Renderiza el botón de borrar con icono
  return (
    <>
      <Button variant="contained" color="error" onClick={() => handleDelete(id)}>
        <DeleteIcon />
      </Button>
    </>
  );
}

export default BotonBorrar;
