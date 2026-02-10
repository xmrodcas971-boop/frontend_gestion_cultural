/**
 * Componente funcional que muestra una tabla con el listado de museos.
 * Incluye opciones para editar y eliminar museos, y exportar a PDF.
 * @module ListadoMuseos
 */
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import PrintIcon from "@mui/icons-material/Print";

import BotonBorrar from "./BotonBorrar";
import BotonEditar from "./BotonEditar";
import Fab from "@mui/material/Fab";
import { Box } from "@mui/material";
import generatePDF from "../utils/generatePDF";

/**
 * Componente principal para mostrar el listado de museos.
 * Utiliza estados para gestionar los datos, errores y renderizado de la tabla.
 * @returns {JSX.Element} Renderizado de la tabla de museos y controles asociados.
 */
function ListadoMuseos() {
  /**
   * Datos de los museos obtenidos desde la API.
   * @type {Array<Object>}
   */
  const [datos, setDatos] = useState([]);
  /**
   * Mensaje de error en caso de fallo al obtener los datos.
   * @type {string|null}
   */
  const [error, setError] = useState(null);

  /**
   * Hook de efecto para obtener los datos de los museos al cargar el componente.
   * Llama a la función asíncrona fetchMuseos una sola vez al montar el componente.
   */
  useEffect(() => {
    /**
     * Función asíncrona para obtener los datos de los museos desde la API.
     * @async
     * @function
     * @returns {Promise<void>}
     */
    async function fetchMuseos() {
      try {
        let response = await fetch("http://localhost:3000/api/museums/");
        if (response.ok) {
          let datosMuseos = await response.json();
          setDatos(datosMuseos.datos);
          setError(null);
        } else {
          setError("Respuesta errónea del servidor.");
          setDatos([]);
        }
      } catch (e) {
        setError("No se pudo conectar al servidor: " + e.toString());
        setDatos([]);
      }
    }
    fetchMuseos();
  }, []);

  // Renderizado de mensaje de error si ocurre algún problema al obtener los datos
  if (error != null) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        {error}
      </Typography>
    );
  }

  // Renderizado de mensaje si no hay datos disponibles
  if (!datos || datos.length === 0) {
    return (
      <>
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          No hay datos disponibles
        </Typography>
      </>
    );
  }

  // Renderizado principal de la tabla de museos y controles
  return (
    <>
      <Typography variant="h4" align="center" color="primary" sx={{ my: 3 }}>
        Listado de museos
      </Typography>

      <Box id="pdf-content">
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="tabla museos">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Ciudad</TableCell>
                <TableCell align="right">Presupuesto (€)</TableCell>
                <TableCell align="center">Público</TableCell>
                <TableCell align="center">Fecha apertura</TableCell>
                {/* Añadimos className="omitir-pdf" a los encabezados para excluirlos del PDF */}
                <TableCell align="center" className="omitir-pdf">
                  Borrar
                </TableCell>
                <TableCell align="center" className="omitir-pdf">
                  Editar
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {datos.map((row) => (
                <TableRow key={row.museum_id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell align="right">{row.annual_budget}</TableCell>
                  <TableCell align="center">
                    <Chip label={row.is_public ? "Si" : "No"} color={row.is_public ? "success" : "default"} size="small" />
                  </TableCell>
                  <TableCell align="center">{row.opening_date}</TableCell>

                  {/* Añadimos className="omitir-pdf" a las celdas de los botones para excluirlos del PDF */}
                  <TableCell align="center" className="omitir-pdf">
                    <BotonBorrar ruta="/museums/" id={row.museum_id} />
                  </TableCell>

                  <TableCell align="center" className="omitir-pdf">
                    <BotonEditar ruta="/museums/editar/" id={row.museum_id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Fab
        color="secondary"
        aria-label="imprimir"
        onClick={() => generatePDF("pdf-content", "museos")}
        sx={{
          position: "fixed",
          top: 85,
          right: 20,
        }}
      >
        <PrintIcon />
      </Fab>
    </>
  );
}

export default ListadoMuseos;
