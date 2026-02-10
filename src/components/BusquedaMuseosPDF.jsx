/**
 * Componente para generar un documento PDF con los resultados de búsqueda de museos.
 * Utiliza @react-pdf/renderer para crear una tabla con los datos proporcionados.
 * @module BusquedaMuseosPDF
 */
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Estilos para el PDF usando react-pdf
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    display: "table",
    width: "100%",
    marginTop: 20,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "33.33%", // Ajustado para 3 columnas
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#f0f0f0",
    padding: 8,
    fontWeight: "bold",
  },
  tableCol: {
    width: "33.33%", // Ajustado para 3 columnas
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 8,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 9,
  },
});

/**
 * Componente funcional que genera un PDF con los resultados de museos.
 * @param {{ data: Array<{name: string, city: string, annual_budget: number}> }} props
 * @returns {JSX.Element} Documento PDF con tabla de museos.
 */
function BusquedaMuseosPDF({ data }) {
  // Renderiza el documento PDF con la tabla de resultados
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.title}>
          <Text>Resultados de Búsqueda de Museos</Text>
        </View>

        <View style={styles.table}>
          {/* Cabecera */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Nombre</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Ciudad</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Presupuesto</Text>
            </View>
          </View>

          {/* Filas de datos */}
          {data.map((museo, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{museo.name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{museo.city}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{museo.annual_budget ? `${museo.annual_budget} €` : "0 €"}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

export default BusquedaMuseosPDF;
