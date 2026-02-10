/**
 * Componente de formulario para editar una sala existente.
 * Permite modificar los datos de una sala y enviarlos al backend para su actualización.
 * @module EditarSala
 */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import MenuItem from "@mui/material/MenuItem";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import "dayjs/locale/es";

// --- CAMBIO 1: Importamos api ---
import api from "../api";

/**
 * Componente funcional que renderiza el formulario de edición de salas.
 * Utiliza estados locales para gestionar los campos del formulario y el envío de datos.
 * @returns {JSX.Element} Renderizado del formulario de edición de sala.
 */
function EditarSala() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sala, setSala] = useState({
    name: "",
    capacity: "",
    area: "",
    is_climatized: "",
    opening_date: null,
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

  /* Cargar datos de la SALA */
  useEffect(() => {
    async function fetchRoom() {
      try {
        const response = await api.get(`/rooms/${id}`);
        if (response && response.datos) {
          setSala(response.datos);
        }
      } catch (e) {
        console.error("Error cargando sala", e);
        setDialogMessage("No se pudieron cargar los datos de la sala");
        setDialogSeverity("error");
        setOpenDialog(true);
      }
    }
    fetchRoom();
  }, [id]);

  /* Cargar lista de MUSEOS para el desplegable */
  useEffect(() => {
    async function fetchMuseos() {
      try {
        const response = await api.get("/museums/");
        if (response && response.datos) {
          setMuseos(response.datos);
        }
      } catch (e) {
        console.error("Error cargando museos:", e);
        // No bloqueamos la edición, pero avisamos si es crítico o simplemente el select estará vacío
      }
    }
    fetchMuseos();
  }, []);

  /* Actualizar sala (PUT) */
  useEffect(() => {
    async function fetchEditRoom() {
      try {
        await api.put(`/rooms/${id}`, sala);
        
        setDialogMessage("Sala actualizada correctamente");
        setDialogSeverity("success");
        setOpenDialog(true);
      } catch (e) {
        setDialogMessage(e.mensaje || "Error al actualizar la sala");
        setDialogSeverity("error");
        setOpenDialog(true);
      } finally {
        setIsUpdating(false);
      }
    }

    if (isUpdating) fetchEditRoom();
  }, [isUpdating, sala, id]);

  function handleChange(e) {
    setSala({ ...sala, [e.target.name]: e.target.value });
  }

  function handleClick() {
    if (isUpdating) return;
    if (validarDatos()) setIsUpdating(true);
  }

  function handleDialogClose() {
    setOpenDialog(false);
    if (dialogSeverity === "success") navigate("/rooms"); // Redirige a la lista de salas
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

    // Validación flexible para booleanos (puede venir como true/false o "true"/"false")
    if (sala.is_climatized !== true && sala.is_climatized !== false && sala.is_climatized !== "true" && sala.is_climatized !== "false") {
      validacion.is_climatized = false;
      valido = false;
    }

    if (!sala.opening_date) {
      validacion.opening_date = false;
      valido = false;
    }

    if (!sala.museum_id) {
      validacion.museum_id = false;
      valido = false;
    }

    setIsCamposValidos(validacion);
    return valido;
  }

  return (
    <>
      <Grid container spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
        <Grid item xs={12} sm={9} md={7}>
          <Paper elevation={6} sx={{ mt: 3, p: 3, maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" align="center" color="primary" sx={{ mb: 3 }}>
              Editar sala
            </Typography>

            <Grid container spacing={2} sx={{ justifyContent: "center" }}>
              <Grid item xs={10} md={6}>
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

              <Grid item xs={10} md={6}>
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

              <Grid item xs={10} md={6}>
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

              <Grid item xs={10} md={6}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Climatizada"
                  name="is_climatized"
                  // Controlamos que el valor sea compatible con los MenuItems
                  value={sala.is_climatized === "" ? "" : sala.is_climatized}
                  onChange={(e) => setSala({ ...sala, is_climatized: e.target.value })}
                  error={!isCamposValidos.is_climatized}
                >
                  <MenuItem value={true}>Sí</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={10} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    label="Fecha de apertura"
                    value={sala.opening_date ? dayjs(sala.opening_date) : null}
                    onChange={(newValue) => setSala({ ...sala, opening_date: newValue ? newValue.format("YYYY-MM-DD") : null })}
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true,
                        error: !isCamposValidos.opening_date,
                        helperText: !isCamposValidos.opening_date ? "La fecha es obligatoria" : "",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* DESPLEGABLE DE MUSEOS */}
              <Grid item xs={10} md={6}>
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

              <Grid item xs={10} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" sx={{ mt: 3 }} disabled={isUpdating} onClick={handleClick}>
                  {isUpdating ? "Guardando..." : "Guardar cambios"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{dialogSeverity === "success" ? "Operación correcta" : "Error"}</DialogTitle>
        <DialogContent dividers>
          <Alert severity={dialogSeverity} variant="filled">
            {dialogMessage}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditarSala;