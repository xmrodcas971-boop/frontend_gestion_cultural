/**
 * Componente de página de bienvenida con slider de información destacada.
 * Permite navegar entre diferentes slides con información cultural.
 * @module LandingPage
 */
import { useState } from "react";
import { Box, Button, Typography, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

const slides = [
  {
    title: "Descubre las reliquias Históricas",
    subtitle: "Busca y explora museos y sitios históricos cercanos.",
    image: "https://images.unsplash.com/photo-1636307268087-82fea49c541e?q=80&w=1889&auto=format&fit=crop",
  },
  {
    title: "Salas Temáticas Interactivas",
    subtitle: "Explora nuestras salas tematicas.",
    image: "https://images.unsplash.com/photo-1636092147336-c92d2970967d?q=80&w=1470&auto=format&fit=crop",
  },
  {
    title: "Comunidad Cultural Activa",
    subtitle: "Únete a clubes y participa en actividades culturales.",
    image: "https://images.unsplash.com/photo-1577453191301-21389424a818?w=600&auto=format&fit=crop&q=60",
  },
];

/**
 * Componente funcional que renderiza la página de bienvenida con slider.
 * Utiliza estados para gestionar el slide actual y la navegación entre slides.
 * @returns {JSX.Element} Renderizado del slider y controles de navegación.
 */
function LandingPage() {
  const navigate = useNavigate();
  /**
   * Índice del slide actualmente visible.
   * @type {number}
   */
  const [index, setIndex] = useState(0);

  /**
   * Avanza al siguiente slide del slider.
   */
  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
  /**
   * Retrocede al slide anterior del slider.
   */
  const prevSlide = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[index];

  // Renderiza el slider de bienvenida y los controles de navegación
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* SLIDER */}
      <Box
        sx={{
          height: 500,
          backgroundImage: `url(${slide.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "white",
            px: 2,
          }}
        >
          <Typography variant="h3" gutterBottom>
            {slide.title}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {slide.subtitle}
          </Typography>
          <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => navigate("/museums/new")}>
            Comenzar
          </Button>
        </Box>

        {/* CONTROLES SLIDER */}
        <Button
          aria-label="Slide anterior"
          onClick={prevSlide}
          sx={{
            position: "absolute",
            top: "50%",
            left: 16,
            transform: "translateY(-50%)",
            color: "white",
          }}
        >
          ‹
        </Button>

        <Button
          aria-label="Slide siguiente"
          onClick={nextSlide}
          sx={{
            position: "absolute",
            top: "50%",
            right: 16,
            transform: "translateY(-50%)",
            color: "white",
          }}
        >
          ›
        </Button>
      </Box>

      {/* SECCIÓN INFORMATIVA */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom color="primary">
              Bienvenido a Gestión Cultural
            </Typography>
            <Typography variant="body1" paragraph>
              En Gestión Cultural, fomentamos el amor por la historia y la cultura que nos rodea. Si deseas explorar museos, unirte a clubes culturales o
              participar en actividades educativas, ¡estás en el lugar correcto!
            </Typography>
            <Button variant="contained" color="secondary" size="large" onClick={() => navigate("/museums")}>
              Ver Museos
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Avatar src="https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
              <Avatar src="https://images.unsplash.com/photo-1491156855053-9cdff72c7f85?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
              <Avatar src="https://images.unsplash.com/photo-1513038630932-13873b1a7f29?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingPage;
