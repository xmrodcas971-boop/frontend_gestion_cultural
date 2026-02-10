/**
 * Componente funcional que muestra una tabla con el listado de salas.
 * Incluye el nombre del museo asociado y opciones para editar o eliminar cada sala.
 * @module ListadoSalas
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
import Container from "@mui/material/Container";

import BotonBorrar from "./BotonBorrar";
import BotonEditar from "./BotonEditar";

// --- CAMBIO 1: Importar api ---
import api from "../api";

/**
 * Componente principal para mostrar el listado de salas.
 * Utiliza estados para gestionar los datos, errores y renderizado de la tabla.
 * @returns {JSX.Element} Renderizado de la tabla de salas y controles asociados.
 */
function ListadoSalas() {
  /**
   * Datos de las salas combinados con el nombre del museo.
   */
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Hook de efecto para obtener los datos.
   * Usamos Promise.all para cargar salas y museos en paralelo.
   */
  useEffect(() => {
    async function fetchData() {
      try {
        // --- CAMBIO 2: Peticiones en paralelo ---
        const [responseSalas, responseMuseos] = await Promise.all([
          api.get("/rooms/"),
          api.get("/museums/"),
        ]);

        const salas = responseSalas.datos || [];
        const museos = responseMuseos.datos || [];

        // --- CAMBIO 3: Crear mapa de museos (ID -> Nombre) ---
        const mapaMuseos = {};
        museos.forEach((museo) => {
          mapaMuseos[museo.museum_id] = museo.name;
        });

        // --- CAMBIO 4: Combinar datos ---
        const datosCompletos = salas.map((sala) => ({
          ...sala,
          museum_name: mapaMuseos[sala.museum_id] || "Desconocido",
        }));

        setDatos(datosCompletos);
        setError(null);
      } catch (e) {
        console.error(e);
        setError(e.mensaje || "Error al cargar los datos del servidor.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Manejo de errores
  if (error) {
    return (
      <Typography variant="h5" align="center" color="error" sx={{ mt: 3 }}>
        {error}
      </Typography>
    );
  }

  // Manejo de carga vacía
  if (!loading && (!datos || datos.length === 0)) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        No hay salas registradas.
      </Typography>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" align="center" color="primary" sx={{ my: 3 }}>
        Listado de salas
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table stickyHeader aria-label="tabla salas">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Capacidad</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Área (m²)</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Climatizada</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Fecha apertura</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Museo</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Borrar</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Editar</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {datos.map((row) => (
              <TableRow key={row.room_id} hover>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.capacity}</TableCell>
                <TableCell align="right">{row.area}</TableCell>
                
                <TableCell align="center">
                  <Chip 
                    label={row.is_climatized ? "Sí" : "No"} 
                    color={row.is_climatized ? "success" : "default"} 
                    variant="outlined"
                    size="small" 
                  />
                </TableCell>
                
                <TableCell align="center">
                  {new Date(row.opening_date).toLocaleDateString()}
                </TableCell>

                {/* Nombre del museo calculado previamente */}
                <TableCell align="center">
                    <Chip label={row.museum_name} color="primary" variant="outlined" size="small" />
                </TableCell>

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
    </Container>
  );
}

export default ListadoSalas;