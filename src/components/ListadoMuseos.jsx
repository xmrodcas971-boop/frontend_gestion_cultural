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
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import BotonBorrar from "./BotonBorrar";
import BotonEditar from "./BotonEditar";
import generatePDF from "../utils/generatePDF";

// --- CAMBIO 1: Importar api ---
import api from "../api";

/**
 * Componente principal para mostrar el listado de museos.
 * Utiliza estados para gestionar los datos, errores y renderizado de la tabla.
 * @returns {JSX.Element} Renderizado de la tabla de museos y controles asociados.
 */
function ListadoMuseos() {
  /**
   * Datos de los museos obtenidos desde la API.
   */
  const [datos, setDatos] = useState([]);
  /**
   * Mensaje de error en caso de fallo al obtener los datos.
   */
  const [error, setError] = useState(null);
  
  // Estado opcional para mostrar un indicador de carga si quisieras
  const [loading, setLoading] = useState(true);

  /**
   * Hook de efecto para obtener los datos de los museos al cargar el componente.
   */
  useEffect(() => {
    async function fetchMuseos() {
      try {
        // --- CAMBIO 2: Petición con api.get ---
        const response = await api.get("/museums/");
        
        // El interceptor devuelve la respuesta parseada
        if (response && response.datos) {
          setDatos(response.datos);
          setError(null);
        } else {
          setDatos([]);
        }
      } catch (e) {
        console.error(e);
        setError(e.mensaje || "No se pudo conectar al servidor.");
      } finally {
        setLoading(false);
      }
    }

    fetchMuseos();
  }, []);

  // Renderizado de mensaje de error
  if (error) {
    return (
      <Typography variant="h5" align="center" color="error" sx={{ mt: 3 }}>
        {error}
      </Typography>
    );
  }

  // Renderizado si no hay datos (y ya terminó de cargar)
  if (!loading && (!datos || datos.length === 0)) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        No hay museos registrados.
      </Typography>
    );
  }

  // Renderizado principal de la tabla de museos
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" align="center" color="primary" sx={{ my: 3 }}>
        Listado de museos
      </Typography>

      <Box id="pdf-content">
        <TableContainer component={Paper} elevation={3}>
          <Table stickyHeader aria-label="tabla museos">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Ciudad</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>Presupuesto (€)</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Público</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Fecha apertura</TableCell>
                
                {/* Columnas de acciones (se ocultan en PDF) */}
                <TableCell align="center" className="omitir-pdf" sx={{ fontWeight: "bold" }}>
                  Borrar
                </TableCell>
                <TableCell align="center" className="omitir-pdf" sx={{ fontWeight: "bold" }}>
                  Editar
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {datos.map((row) => (
                <TableRow key={row.museum_id} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(row.annual_budget)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={row.is_public ? "Sí" : "No"} 
                      color={row.is_public ? "success" : "default"} 
                      variant="outlined"
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    {new Date(row.opening_date).toLocaleDateString()}
                  </TableCell>

                  {/* Botones de acciones */}
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

      {/* Botón flotante para PDF */}
      <Fab
        color="primary"
        aria-label="imprimir"
        onClick={() => generatePDF("pdf-content", "Listado_Museos")}
        sx={{
          position: "fixed",
          bottom: 20, // Lo he movido abajo a la derecha, que es más estándar en Material UI
          right: 20,
        }}
      >
        <PrintIcon />
      </Fab>
    </Container>
  );
}

export default ListadoMuseos;