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

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import "dayjs/locale/es";

function AltaMuseo() {
  const navigate = useNavigate();

  const [museo, setMuseo] = useState({
    name: "",
    city: "",
    annual_budget: "",
    is_public: "",
    opening_date: "",
  });

  const [isCamposValidos, setIsCamposValidos] = useState({
    name: true,
    city: true,
    annual_budget: true,
    is_public: true,
    opening_date: true,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSeverity, setDialogSeverity] = useState("success");

  useEffect(() => {
    async function fetchCreateMuseum() {
      try {
        const response = await fetch("http://localhost:3000/api/museums/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(museo),
        });

        if (response.ok) {
          let respuesta = await response.json();
          setDialogMessage(respuesta.mensaje); // Mensaje
          setDialogSeverity("success"); // Color verde
          setOpenDialog(true); // Abrir el diálogo
        } else {
          console.error(`Error ${response.status}:`, response.statusText);
          setDialogMessage("Error del servidor"); // Mensaje
          setDialogSeverity("error"); // Color rojo
          setOpenDialog(true); // Abrir el diálogo
        }
      } catch (e) {
        console.error("Error en fetch:", e); // para debugging
        setDialogMessage(`Error de conexión: ${e.message || "desconocido"}`);
        setDialogSeverity("error");
        setOpenDialog(true);
      }
      // Pase lo que pase hemos terminado el proceso de actualización
      setIsUpdating(false);
    }

    if (isUpdating) fetchCreateMuseum();
  }, [isUpdating, museo]);

  function handleChange(e) {
    setMuseo({ ...museo, [e.target.name]: e.target.value });
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
      city: true,
      annual_budget: true,
      is_public: true,
      opening_date: true,
    };

    // Nombre
    if (!museo.name || museo.name.length < 3 || museo.name.length > 100) {
      validacion.name = false;
      valido = false;
    }

    // Ciudad
    if (!museo.city || museo.city.length < 3 || museo.city.length > 100) {
      validacion.city = false;
      valido = false;
    }

    // Presupuesto anual
    if (museo.annual_budget === "" || isNaN(museo.annual_budget) || Number(museo.annual_budget) < 0) {
      validacion.annual_budget = false;
      valido = false;
    }

    // Público (boolean)
    if (museo.is_public !== true && museo.is_public !== false) {
      validacion.is_public = false;
      valido = false;
    }

    // Fecha apertura
    if (!museo.opening_date) {
      validacion.opening_date = false;
      valido = false;
    }

    setIsCamposValidos(validacion);
    return valido;
  }

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
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
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
              <Grid item size={{ xs: 10 }}>
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

              <Grid item size={{ xs: 10 }}>
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

              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  fullWidth
                  label="Presupuesto anual (€)"
                  name="annual_budget"
                  type="number"
                  inputProps={{ step: "0.01", min: 0 }}
                  value={museo.annual_budget}
                  onChange={handleChange}
                  error={!isCamposValidos.annual_budget}
                  helperText={!isCamposValidos.annual_budget && "Debe ser un número positivo."}
                />
              </Grid>

              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Museo público"
                  SelectProps={{ native: true }}
                  value={museo.is_public}
                  onChange={(e) =>
                    setMuseo({
                      ...museo,
                      is_public: e.target.value === "true",
                    })
                  }
                  error={!isCamposValidos.is_public}
                  helperText={!isCamposValidos.is_public && "Campo obligatorio."}
                >
                  <option value=""></option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </TextField>
              </Grid>

              <Grid item size={{ xs: 10 }}>
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
