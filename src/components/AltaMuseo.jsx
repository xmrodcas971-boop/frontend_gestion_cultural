/**
 * Componente de formulario para dar de alta un nuevo museo.
 * Permite ingresar los datos de un museo y enviarlos al backend para su registro.
 * @module AltaMuseo
 */
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

// --- CAMBIO 1: Importamos tu instancia de API configurada ---
// Ajusta la ruta "../api" si tu archivo api.js está en otro lugar
import api from "../api"; 

/**
 * Componente funcional que renderiza el formulario de alta de museos.
 * Utiliza estados locales para gestionar los campos del formulario y el envío de datos.
 * @returns {JSX.Element} Renderizado del formulario de alta de museo.
 */
function AltaMuseo() {
  /**
   * Hook de navegación para redireccionar tras el alta.
   */
  const navigate = useNavigate();

  /**
   * Estado para los datos del museo a registrar.
   */
  const [museo, setMuseo] = useState({
    name: "",
    city: "",
    annual_budget: "",
    is_public: "",
    opening_date: "",
  });

  /**
   * Estado para la validación de los campos del formulario.
   */
  const [isCamposValidos, setIsCamposValidos] = useState({
    name: true,
    city: true,
    annual_budget: true,
    is_public: true,
    opening_date: true,
  });

  /**
   * Estado para indicar si se está enviando el formulario.
   */
  const [isUpdating, setIsUpdating] = useState(false);
  /**
   * Estado para controlar la apertura del diálogo de resultado.
   */
  const [openDialog, setOpenDialog] = useState(false);
  /**
   * Mensaje mostrado en el diálogo de resultado.
   */
  const [dialogMessage, setDialogMessage] = useState("");
  /**
   * Severidad del mensaje en el diálogo (success/error).
   */
  const [dialogSeverity, setDialogSeverity] = useState("success");

  /**
   * Efecto que envía los datos al backend cuando isUpdating es true.
   * --- CAMBIO 2: Lógica actualizada para usar 'api' en vez de 'fetch' ---
   */
  useEffect(() => {
    async function fetchCreateMuseum() {
      try {
        // Usamos api.post. La URL base ya está en api.js, solo ponemos el endpoint
        const response = await api.post("/museums", museo);

        // Si llega aquí, es que la respuesta fue exitosa (el interceptor ya extrajo response.data)
        setDialogMessage(response.mensaje || "Museo creado correctamente");
        setDialogSeverity("success");
        setOpenDialog(true);
        
      } catch (error) {
        // Si falla, capturamos el error procesado por tu interceptor
        console.error("Error en la petición:", error);
        setDialogMessage(error.mensaje || "Error al conectar con el servidor");
        setDialogSeverity("error");
        setOpenDialog(true);
      }
      setIsUpdating(false);
    }

    if (isUpdating) fetchCreateMuseum();
  }, [isUpdating, museo]);

  /**
   * Maneja el cambio de los campos del formulario.
   * @param {React.ChangeEvent} e
   */
  function handleChange(e) {
    setMuseo({ ...museo, [e.target.name]: e.target.value });
  }

  /**
   * Maneja el click en el botón de aceptar.
   * Valida los datos y activa el envío si es válido.
   */
  function handleClick() {
    if (isUpdating) return;
    if (validarDatos()) setIsUpdating(true);
  }

  /**
   * Cierra el diálogo de resultado y redirige si la operación fue exitosa.
   */
  function handleDialogClose() {
    setOpenDialog(false);
    if (dialogSeverity === "success") navigate("/");
  }

  /**
   * Valida los datos del formulario y actualiza el estado de validación.
   * @returns {boolean} true si los datos son válidos, false en caso contrario.
   */
  function validarDatos() {
    let valido = true;

    let validacion = {
      name: true,
      city: true,
      annual_budget: true,
      is_public: true,
      opening_date: true,
    };

    if (!museo.name || museo.name.length < 3 || museo.name.length > 100) {
      validacion.name = false;
      valido = false;
    }

    if (!museo.city || museo.city.length < 3 || museo.city.length > 100) {
      validacion.city = false;
      valido = false;
    }

    if (museo.annual_budget === "" || isNaN(museo.annual_budget) || Number(museo.annual_budget) < 0) {
      validacion.annual_budget = false;
      valido = false;
    }

    if (museo.is_public !== true && museo.is_public !== false) {
      validacion.is_public = false;
      valido = false;
    }

    if (!museo.opening_date) {
      validacion.opening_date = false;
      valido = false;
    }

    setIsCamposValidos(validacion);
    return valido;
  }

  // Renderiza el formulario de alta de museo y el diálogo de resultado
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item size={{ xs: 12, sm: 9, md: 7 }}>
          <Paper elevation={6} sx={{ mt: 3, p: 3, maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" align="center" color="primary" sx={{ mb: 3 }}>
              Alta de museo
            </Typography>

            <Grid
              container
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid item size={{ xs: 10, md: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="Nombre"
                  name="name"
                  value={museo.name}
                  onChange={handleChange}
                  error={!isCamposValidos.name}
                  helperText={!isCamposValidos.name && "Compruebe el formato del nombre."}
                />
              </Grid>

              <Grid item size={{ xs: 10, md: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="Ciudad"
                  name="city"
                  value={museo.city}
                  onChange={handleChange}
                  error={!isCamposValidos.city}
                  helperText={!isCamposValidos.city && "Compruebe el formato de la ciudad."}
                />
              </Grid>

              <Grid item size={{ xs: 10, md: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="Presupuesto anual (€)"
                  name="annual_budget"
                  type="number"
                  value={museo.annual_budget}
                  onChange={handleChange}
                  error={!isCamposValidos.annual_budget}
                  helperText={!isCamposValidos.annual_budget && "Debe ser un número positivo."}
                />
              </Grid>

              <Grid item size={{ xs: 10, md: 6 }}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Museo público"
                  value={museo.is_public}
                  onChange={(e) =>
                    setMuseo({
                      ...museo,
                      is_public: e.target.value === "true",
                    })
                  }
                  error={!isCamposValidos.is_public}
                >
                  <MenuItem value="">
                    <em>Seleccione una opción</em>
                  </MenuItem>
                  <MenuItem value="true">Sí</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </TextField>
              </Grid>
              <Grid item size={{ xs: 10, md: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    label="Fecha de apertura"
                    value={museo.opening_date ? dayjs(museo.opening_date) : null}
                    onChange={(newValue) =>
                      setMuseo({
                        ...museo,
                        opening_date: newValue.format("YYYY-MM-DD"),
                      })
                    }
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

              <Grid item size={{ xs: 10 }} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" sx={{ mt: 3 }} loading={isUpdating} loadingPosition="end" onClick={handleClick}>
                  Aceptar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleDialogClose} disableEscapeKeyDown aria-labelledby="result-dialog-title">
        <DialogTitle id="result-dialog-title">{dialogSeverity === "success" ? "Operación correcta" : "Error"}</DialogTitle>
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

export default AltaMuseo;