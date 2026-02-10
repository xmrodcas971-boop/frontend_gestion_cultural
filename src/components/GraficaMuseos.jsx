/**
 * Componente funcional que muestra un gráfico de barras con datos de museos.
 * Utiliza la librería Recharts para renderizar el gráfico de forma responsiva.
 * @module GraficaMuseos
 */
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Typography } from "@mui/material";
import api from "../api";

/**
 * Componente principal para mostrar la gráfica de museos.
 * Utiliza estados para gestionar los datos, errores y renderizado del gráfico.
 * @returns {JSX.Element} Renderizado del gráfico de barras con los datos de museos.
 */
function GraficaMuseos() {
  /**
   * Datos de los museos para la gráfica.
   * @type {Array<Object>}
   */
  const [datos, setDatos] = useState([]);
  /**
   * Mensaje de error en caso de fallo al obtener los datos.
   * @type {string|null}
   */
  const [error, setError] = useState(null);

  /**
   * Colores predefinidos para las barras del gráfico.
   * @constant {Array<string>}
   */
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28BFE",
    "#FF4567",
    "#32CD32",
    "#8B008B",
    "#FF1493",
    "#00FFFF",
    "#7FFF00",
    "#D2691E",
    "#DC143C",
    "#FFD700",
    "#ADFF2F",
    "#8A2BE2",
    "#FF6347",
    "#40E0D0",
    "#DA70D6",
    "#FF4500",
    "#1E90FF",
    "#3CB371",
    "#9932CC",
    "#FF8C00",
  ];

  /**
   * Hook de efecto para obtener los datos de los museos al cargar el componente.
   * Llama a la función asíncrona fetchMuseos una sola vez al montar el componente.
   */
  useEffect(() => {
    /**
     * Función asíncrona para obtener los datos de los museos desde la API.
     * @async
     * @function
     * @returns {Promise<void>}
     */
    async function fetchMuseos() {
      try {
        const respuesta = await api.get("/museums/graph");
        // Actualizamos los datos de museos
        setDatos(respuesta.datos);
        // Y no tenemos errores
        setError(null);
      } catch (error) {
        setError(error.mensaje || "No se pudo conectar al servidor");
        setDatos([]);
      }
    }
    fetchMuseos();
  }, []);

  // Usamos el encadenamiento opcional (?.) para evitar el crash si 'museum' es null
  const legendPayload =
    datos?.map((entry, index) => ({
      id: entry.museum?.name || "Desconocido",
      type: "square",
      value: entry.museum?.name || "Desconocido", // Y aquí
      color: COLORS[index % COLORS.length],
    })) || [];

  // Renderizado de mensaje de error si ocurre algún problema al obtener los datos
  if (error != null) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        {error}
      </Typography>
    );
  }

  // Renderizado de mensaje si no hay datos disponibles
  if (!datos || datos.length === 0) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 3 }}>
        No hay datos disponibles
      </Typography>
    );
  }

  // Renderizado principal del gráfico de museos
  return (
    <div style={{ width: "100%", height: "80vh", padding: "20px" }}>
      {/* Título de la gráfica */}
      <Typography variant="h5" align="center" sx={{ mt: 3, mb: 3 }}>
        Número de salas por museo
      </Typography>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* Ejes X e Y */}
          <XAxis dataKey="museum.name" angle={-45} textAnchor="end" interval={0} height={80} tick={{ fontSize: 12 }} />
          <YAxis label={{ value: "Salas", angle: -90, position: "insideLeft" }} />

          {/* Tooltip */}
          <Tooltip cursor={{ fill: "rgba(0,0,0,0.1)" }} />

          {/* Leyenda */}
          <Legend verticalAlign="top" height={50} payload={legendPayload} />

          {/* b. Serie de datos */}
          <Bar dataKey="total" name="Salas">
            {datos.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficaMuseos;
