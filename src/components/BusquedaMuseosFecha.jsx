/**
 * Componente funcional para buscar museos por rango de fechas de apertura.
 * Permite filtrar museos entre dos fechas y muestra los resultados en una tabla.
 * @module BusquedaMuseosFecha
 */
import { useState } from "react";
import PrintIcon from "@mui/icons-material/Print";
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
import Fab from "@mui/material/Fab";

import BotonBorrar from "./BotonBorrar";
import BotonEditar from "./BotonEditar";

// Si tienes el archivo CSS para ocultar elementos al imprimir, impórtalo aquí:
// import styles from "../css/Impresion.module.css";

/**
 * Componente principal para la búsqueda de museos por fecha de apertura.
 * Utiliza estados para gestionar los valores del formulario, los resultados y los errores.
 * @returns {JSX.Element} Renderizado del formulario y resultados de búsqueda.
 */
function BusquedaMuseosFecha() {
  /**
   * Fecha de inicio del rango de búsqueda.
   * @type {string}
   */
  const [from, setFrom] = useState("");
  /**
   * Fecha de fin del rango de búsqueda.
   * @type {string}
   */
  const [to, setTo] = useState("");

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
   * Realiza la petición al backend para buscar museos por fecha de apertura.
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
    if (!from || !to) {
      setError("Debe indicar fecha de inicio y fecha de fin");
      return;
    }

    // Validación: la fecha de inicio no puede ser posterior a la de fin
    if (new Date(from) > new Date(to)) {
      setError("La fecha de inicio no puede ser posterior a la fecha de fin");
      return;
    }

    try {
      // Petición al backend para obtener museos en el rango de fechas
      const response = await fetch(`http://localhost:3000/api/museums/between?from=${from}&to=${to}`);

      const data = await response.json();

      if (response.ok) {
        setDatos(data.datos);
      } else {
        setError(data.mensaje || "No se encontraron museos");
      }
    } catch (e) {
      // Manejo de errores de red o backend
      setError("No se pudo conectar con el servidor" + e);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* FORMULARIO */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
          Búsqueda de museos por fecha de apertura
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField label="Fecha inicio" type="date" fullWidth InputLabelProps={{ shrink: true }} value={from} onChange={(e) => setFrom(e.target.value)} />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField label="Fecha fin" type="date" fullWidth InputLabelProps={{ shrink: true }} value={to} onChange={(e) => setTo(e.target.value)} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Button variant="contained" size="large" fullWidth onClick={handleBuscar} sx={{ height: "56px" }}>
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ERROR */}
      {error && (
        <Typography variant="h6" color="error" align="center" sx={{ mb: 3 }}>
          {error}
        </Typography>
      )}

      {/* RESULTADOS Y BOTÓN FLOTANTE */}
      {/* Aquí comienza la condición: Solo si se buscó y hay datos */}
      {buscado && datos.length > 0 && (
        <>
          {/* TABLA DE RESULTADOS */}
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

          {/* BOTÓN FLOTANTE (Ahora está DENTRO de la condición) */}
          <Fab
            color="secondary"
            aria-label="imprimir"
            onClick={() => window.print()}
            sx={{
              position: "fixed",
              top: 85,
              right: 20,
              zIndex: 1000,
            }}
            // Recuerda añadir className={styles.noprint} si importaste el CSS
          >
            <PrintIcon />
          </Fab>
        </>
      )}
    </Container>
  );
}
export default BusquedaMuseosFecha;
