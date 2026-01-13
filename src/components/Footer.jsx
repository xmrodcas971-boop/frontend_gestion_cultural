import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) => theme.palette.primary.main,
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          Gestión Cultural - Descubre y conecta con la cultura local
        </Typography>
        <Typography variant="body2" color="inherit" align="center">
          {"Copyright © "}
          <Link color="inherit" href="#">
            GestiónCultural
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
