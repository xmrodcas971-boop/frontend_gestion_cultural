import api from "../api";
import { useState } from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

function BotonBorrar({ ruta, id }) {
    const [error, setError] = useState(null);
    const [datos, setDatos] = useState([]);

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

    return (
        <>
            <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(id)}
            >
                <DeleteIcon />
            </Button>
        </>
    );
}

export default BotonBorrar;