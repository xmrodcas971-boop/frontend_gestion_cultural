/**
 * Botón reutilizable para navegar a la edición de un recurso.
 * Redirige a la ruta de edición usando el id proporcionado.
 * @module BotonEditar
 * @param {Object} props
 * @param {string} props.ruta - Ruta base para la edición.
 * @param {number|string} props.id - ID del recurso a editar.
 */
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";


export default function BotonEditar( {ruta, id} ) {

  const navigate = useNavigate();

  /**
   * Redirige a la ruta de edición del recurso.
   * @async
   */
  async function handleEditar() {
    navigate(ruta + id);
  }

  // Renderiza el botón de editar con icono
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleEditar()}
      >
        <EditIcon />
      </Button>
    </>
  );
}