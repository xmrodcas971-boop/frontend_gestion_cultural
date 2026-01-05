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

function ListadoMuseos() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMuseos() {
      try {
        let response = await fetch("http://localhost:3000/api/museums/");

        if (response.ok) {
          let datosMuseos = await response.json();

          // Actualizamos los datos de museos
          setDatos(datosMuseos.datos);

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

    fetchMuseos();
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
        Listado de museos
      </Typography>

      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="tabla museos">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Ciudad</TableCell>
              <TableCell align="right">Presupuesto (€)</TableCell>
              <TableCell align="center">Público</TableCell>
              <TableCell align="center">Fecha apertura</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {datos.map((row) => (
              <TableRow key={row.museum_id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell align="right">{row.opening_date}</TableCell>
                <TableCell align="center">
                  <Chip label={row.is_public ? "Sí" : "No"} color={row.is_public ? "success" : "default"} size="small" />
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

export default ListadoMuseos;
