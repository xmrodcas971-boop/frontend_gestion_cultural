/**
 * Componente funcional que permite buscar museos por rango de presupuesto.
 * Incluye formulario de búsqueda, validaciones y muestra resultados en tabla.
 * @module BusquedaMuseos
 */
import { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import Fab from "@mui/material/Fab";
import DownloadIcon from "@mui/icons-material/Download";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BusquedaMuseosPDF from "./BusquedaMuseosPDF"; // El diseño que creamos antes

import BotonBorrar from "./BotonBorrar";
import BotonEditar from "./BotonEditar";

/**
 * Componente principal para la búsqueda de museos por presupuesto.
 * Utiliza estados para gestionar los valores del formulario, los resultados y los errores.
 * @returns {JSX.Element} Renderizado del formulario y resultados de búsqueda.
 */
function BusquedaMuseos() {
  /**
   * Presupuesto mínimo introducido por el usuario.
   * @type {string}
   */
  const [min, setMin] = useState("");
  /**
   * Presupuesto máximo introducido por el usuario.
   * @type {string}
   */
  const [max, setMax] = useState("");
  /**
   * Resultados de museos obtenidos tras la búsqueda.
   * @type {Array<Object>}
   */
  const [datos, setDatos] = useState([]);
  /**
   * Mensaje de error en caso de fallo en la búsqueda.
   * @type {string|null}
   */
  const [error, setError] = useState(null);
  /**
   * Indica si se ha realizado una búsqueda.
   * @type {boolean}
   */
  const [buscado, setBuscado] = useState(false);

  /**
   * Realiza la petición al backend para buscar museos por presupuesto.
   * Valida los campos antes de enviar la petición.
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const handleBuscar = async () => {
    setBuscado(true);
    setError(null);
    setDatos([]);

    // Validación: ambos campos deben estar completos
    if (!min || !max) {
      setError("Debe indicar presupuesto mínimo y máximo");
      return;
    }

    // Validación: el mínimo no puede ser mayor que el máximo
    if (Number(min) > Number(max)) {
      setError("El presupuesto mínimo no puede ser mayor que el máximo");
      return;
    }

    try {
      // Petición al backend para obtener museos en el rango de presupuesto
      const response = await fetch(`http://localhost:3000/api/museums/budget?min=${min}&max=${max}`);
      const data = await response.json();
      if (response.ok) {
        setDatos(data.datos);
      } else {
        setError(data.mensaje || "No se encontraron museos");
      }
    } catch (e) {
      // Manejo de errores de red o backend
      setError("No se pudo conectar con el servidor" + e.toString());
    }
  };

  // Renderizado del formulario, mensajes de error, resultados y botón de descarga PDF
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* FORMULARIO DE BÚSQUEDA */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
          Búsqueda de museos por presupuesto
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField label="Presupuesto mínimo (€)" type="number" fullWidth value={min} onChange={(e) => setMin(e.target.value)} />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField label="Presupuesto máximo (€)" type="number" fullWidth value={max} onChange={(e) => setMax(e.target.value)} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Button variant="contained" size="large" fullWidth onClick={handleBuscar} sx={{ height: "56px" }}>
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* MENSAJE DE ERROR */}
      {error && (
        <Typography variant="h6" color="error" align="center" sx={{ mb: 3 }}>
          {error}
        </Typography>
      )}

      {/* TABLA DE RESULTADOS */}
      {buscado && datos.length > 0 && (
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="tabla museos">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Ciudad</TableCell>
                <TableCell align="right">Presupuesto (€)</TableCell>
                <TableCell align="center">Público</TableCell>
                <TableCell align="center">Fecha apertura</TableCell>
                <TableCell align="center">Borrar</TableCell>
                <TableCell align="center">Editar</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {datos.map((row) => (
                <TableRow key={row.museum_id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell align="right">{row.annual_budget}</TableCell>
                  <TableCell align="center">
                    <Chip label={row.is_public ? "Sí" : "No"} color={row.is_public ? "success" : "default"} size="small" />
                  </TableCell>
                  <TableCell align="center">{row.opening_date}</TableCell>

                  <TableCell align="center">
                    <BotonBorrar ruta="/museums/" id={row.museum_id} />
                  </TableCell>

                  <TableCell align="center">
                    <BotonEditar ruta="/museums/editar/" id={row.museum_id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* BOTÓN FLOTANTE DE DESCARGA PDF */}
      {buscado && datos.length > 0 && (
        <Fab
          aria-label="descargar"
          sx={{
            position: "fixed",
            top: 85,
            right: 20,
            zIndex: 1000,
          }}
        >
          <PDFDownloadLink document={<BusquedaMuseosPDF data={datos} />} fileName="museos_presupuesto.pdf">
            {({ loading }) => (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                {loading ? <Typography sx={{ fontSize: 12 }}>...</Typography> : <DownloadIcon sx={{ color: "white" }} />}
              </Box>
            )}
          </PDFDownloadLink>
        </Fab>
      )}
    </Container>
  );
}
export default BusquedaMuseos;
