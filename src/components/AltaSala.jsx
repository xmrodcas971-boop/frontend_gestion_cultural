import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";

/* Mejora visual en algunos puntos */
import MenuItem from "@mui/material/MenuItem";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import "dayjs/locale/es";

function AltaSala() {
  const navigate = useNavigate();

  const [sala, setSala] = useState({
    name: "",
    capacity: "",
    area: "",
    is_climatized: "",
    opening_date: "",
    museum_id: "",
  });

  const [museos, setMuseos] = useState([]);

  const [isCamposValidos, setIsCamposValidos] = useState({
    name: true,
    capacity: true,
    area: true,
    is_climatized: true,
    opening_date: true,
    museum_id: true,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSeverity, setDialogSeverity] = useState("success");

  /* Fetch de museos para el desplegable */
  useEffect(() => {
    async function fetchMuseos() {
      try {
        const response = await fetch("http://localhost:3000/api/museums/");
        if (response.ok) {
          const datos = await response.json();
          setMuseos(datos.datos);
        }
      } catch (e) {
        console.error("Error cargando museos:", e.toString());
      }
    }

    fetchMuseos();
  }, []);

  /* Post para crear la sala */
  useEffect(() => {
    async function fetchCreateRoom() {
      try {
        const response = await fetch("http://localhost:3000/api/rooms/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sala),
        });

        if (response.ok) {
          let respuesta = await response.json();
          setDialogMessage(respuesta.mensaje);
          setDialogSeverity("success");
          setOpenDialog(true);
        } else {
          setDialogMessage("Error del servidor");
          setDialogSeverity("error");
          setOpenDialog(true);
        }
      } catch (e) {
        setDialogMessage(`Error de conexión: ${e.message || "desconocido"}`);
        setDialogSeverity("error");
        setOpenDialog(true);
      }

      setIsUpdating(false);
    }

    if (isUpdating) fetchCreateRoom();
  }, [isUpdating, sala]);

  function handleChange(e) {
    setSala({ ...sala, [e.target.name]: e.target.value });
  }

  function handleClick() {
    if (isUpdating) return;
    if (validarDatos()) setIsUpdating(true);
  }

  function handleDialogClose() {
    setOpenDialog(false);
    if (dialogSeverity === "success") navigate("/");
  }

  function validarDatos() {
    let valido = true;

    let validacion = {
      name: true,
      capacity: true,
      area: true,
      is_climatized: true,
      opening_date: true,
      museum_id: true,
    };

    if (!sala.name || sala.name.length < 3 || sala.name.length > 100) {
      validacion.name = false;
      valido = false;
    }

    if (sala.capacity === "" || isNaN(sala.capacity) || Number(sala.capacity) <= 0) {
      validacion.capacity = false;
      valido = false;
    }

    if (sala.area === "" || isNaN(sala.area) || Number(sala.area) <= 0) {
      validacion.area = false;
      valido = false;
    }

    if (sala.is_climatized !== true && sala.is_climatized !== false) {
      validacion.is_climatized = false;
      valido = false;
    }

    if (!sala.opening_date) {
      validacion.opening_date = false;
      valido = false;
    }

    if (sala.museum_id === "" || isNaN(sala.museum_id) || Number(sala.museum_id) <= 0) {
      validacion.museum_id = false;
      valido = false;
    }

    setIsCamposValidos(validacion);
    return valido;
  }

  return (
    <>
      <Grid container spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
        <Grid item size={{ xs: 12, sm: 9, md: 7 }}>
          <Paper elevation={6} sx={{ mt: 3, p: 3, maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" align="center" color="primary" sx={{ mb: 3 }}>
              Alta de sala
            </Typography>

            <Grid container spacing={2} sx={{ justifyContent: "center" }}>
              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  fullWidth
                  label="Nombre"
                  name="name"
                  value={sala.name}
                  onChange={handleChange}
                  error={!isCamposValidos.name}
                  helperText={!isCamposValidos.name && "Compruebe el formato del nombre."}
                />
              </Grid>

              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  fullWidth
                  label="Capacidad"
                  name="capacity"
                  type="number"
                  value={sala.capacity}
                  onChange={handleChange}
                  error={!isCamposValidos.capacity}
                  helperText={!isCamposValidos.capacity && "Debe ser un número positivo."}
                />
              </Grid>

              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  fullWidth
                  label="Área (m²)"
                  name="area"
                  type="number"
                  value={sala.area}
                  onChange={handleChange}
                  error={!isCamposValidos.area}
                  helperText={!isCamposValidos.area && "Debe ser un número positivo."}
                />
              </Grid>

              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Climatizada"
                  value={sala.is_climatized}
                  onChange={(e) => setSala({ ...sala, is_climatized: e.target.value === "true" })}
                  error={!isCamposValidos.is_climatized}
                >
                  <MenuItem value="">
                    <em>Seleccione una opción</em>
                  </MenuItem>
                  <MenuItem value="true">Sí</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </TextField>
              </Grid>

              <Grid item size={{ xs: 10 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    label="Fecha de apertura"
                    value={sala.opening_date ? dayjs(sala.opening_date) : null}
                    onChange={(newValue) => setSala({ ...sala, opening_date: newValue.format("YYYY-MM-DD") })}
                    slotProps={{
                      textField: {
                        required: true,
                        error: !isCamposValidos.opening_date,
                        helperText: !isCamposValidos.opening_date ? "La fecha es obligatoria" : "",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* DESPLEGABLE DE MUSEOS */}
              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Museo"
                  name="museum_id"
                  value={sala.museum_id}
                  onChange={handleChange}
                  error={!isCamposValidos.museum_id}
                  helperText={!isCamposValidos.museum_id && "Debe seleccionar un museo válido"}
                >
                  <MenuItem value="">
                    <em>Seleccione un museo</em>
                  </MenuItem>

                  {museos.map((museo) => (
                    <MenuItem key={museo.museum_id} value={museo.museum_id}>
                      {museo.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item size={{ xs: 10 }} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" sx={{ mt: 3 }} onClick={handleClick}>
                  Aceptar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{dialogSeverity === "success" ? "Operación correcta" : "Error"}</DialogTitle>
        <DialogContent>
          <Alert severity={dialogSeverity}>{dialogMessage}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AltaSala;
