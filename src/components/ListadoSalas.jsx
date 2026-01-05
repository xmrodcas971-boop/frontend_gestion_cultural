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

//mostrar el id???

function ListadoSalas() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSalas() {
      try {
        let response = await fetch("http://localhost:3000/api/rooms/");

        if (response.ok) {
          let datosSalas = await response.json();

          // Actualizamos los datos de salas
          setDatos(datosSalas.datos);

          // Y no tenemos errores
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

    fetchSalas();
  }, []);

  if (error != null) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        Listado de salas
      </Typography>

      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="tabla salas">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Capacidad</TableCell>
              <TableCell align="right">Área (m²)</TableCell>
              <TableCell align="center">Climatizada</TableCell>
              <TableCell align="center">Fecha apertura</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ListadoSalas;
