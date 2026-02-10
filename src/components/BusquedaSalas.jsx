/**
 * Componente funcional para buscar salas por rango de área.
 * Permite filtrar salas entre dos valores de área y muestra los resultados en una tabla.
 * @module BusquedaSalas
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

import BotonBorrar from "./BotonBorrar";
import BotonEditar from "./BotonEditar";

/**
 * Componente principal para la búsqueda de salas por área.
 * Utiliza estados para gestionar los valores del formulario, los resultados y los errores.
 * @returns {JSX.Element} Renderizado del formulario y resultados de búsqueda.
 */
function BusquedaSalas() {
  /**
   * Área mínima introducida por el usuario.
   * @type {string}
   */
  const [min, setMin] = useState("");
  /**
   * Área máxima introducida por el usuario.
   * @type {string}
   */
  const [max, setMax] = useState("");
  /**
   * Resultados de salas obtenidos tras la búsqueda.
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
   * Realiza la petición al backend para buscar salas por área.
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
      setError("Debe indicar el área mínima y máxima");
      return;
    }

    // Validación: el área mínima no puede ser mayor que la máxima
    if (Number(min) > Number(max)) {
      setError("El área mínima no puede ser mayor que la máxima");
      return;
    }

    try {
      // Petición al backend para obtener salas en el rango de área
      const responseSalas = await fetch(`http://localhost:3000/api/rooms/area?min=${min}&max=${max}`);

      if (!responseSalas.ok) {
        const err = await responseSalas.json();
        setError(err.mensaje || "No se encontraron salas");
        return;
      }

      const datosSalas = await responseSalas.json();
      // Buscar museos para asociar nombre a cada sala
      const responseMuseos = await fetch("http://localhost:3000/api/museums/");

      if (!responseMuseos.ok) {
        setError("Error al obtener los museos");
        return;
      }

      const datosMuseos = await responseMuseos.json();

      /* Crear mapa museum_id -> nombre */
      const mapaMuseos = {};
      datosMuseos.datos.forEach((museo) => {
        mapaMuseos[museo.museum_id] = museo.name;
      });

      /* Salas con nombre del museo */
      const salasConMuseo = datosSalas.datos.map((sala) => ({
        ...sala,
        museum_name: mapaMuseos[sala.museum_id] || "Desconocido",
      }));
      setDatos(salasConMuseo);
    } catch (e) {
      setError("No se pudo conectar con el servidor: " + e.toString());
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* FORMULARIO */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
          Búsqueda de salas por área
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField label="Área mínima (m²)" type="number" fullWidth value={min} onChange={(e) => setMin(e.target.value)} />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField label="Área máxima (m²)" type="number" fullWidth value={max} onChange={(e) => setMax(e.target.value)} />
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

      {/* RESULTADOS */}
      {buscado && datos.length > 0 && (
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="tabla salas">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Capacidad</TableCell>
                <TableCell align="right">Área (m²)</TableCell>
                <TableCell align="center">Climatizada</TableCell>
                <TableCell align="center">Fecha apertura</TableCell>
                <TableCell align="center">Museo</TableCell>
                <TableCell align="center">Borrar</TableCell>
                <TableCell align="center">Editar</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {datos.map((row) => (
                <TableRow key={row.room_id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">{row.capacity}</TableCell>
                  <TableCell align="right">{row.area}</TableCell>
                  <TableCell align="center">
                    <Chip label={row.is_climatized ? "Sí" : "No"} color={row.is_climatized ? "success" : "default"} size="small" />
                  </TableCell>
                  <TableCell align="center">{row.opening_date}</TableCell>

                  {/* Nombre del museo */}
                  <TableCell align="center">{row.museum_name}</TableCell>

                  {/* BOTÓN BORRAR */}
                  <TableCell align="center">
                    <BotonBorrar ruta="/rooms/" id={row.room_id} />
                  </TableCell>

                  {/* BOTÓN EDITAR */}
                  <TableCell align="center">
                    <BotonEditar ruta="/rooms/editar/" id={row.room_id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
export default BusquedaSalas;
