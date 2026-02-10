/**
 * Componente de barra de navegación principal de la aplicación.
 * Permite la navegación entre las diferentes páginas del sistema de gestión cultural.
 * @module Navbar
 */
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";

//icon
import MuseumIcon from "@mui/icons-material/Museum";

/**
 * Componente funcional que renderiza la barra de navegación superior.
 * Utiliza Material UI y React Router para la navegación entre rutas y el diseño responsivo.
 * @returns {JSX.Element} Renderizado de la barra de navegación.
 */
function Navbar() {
  /**
   * Estado para el ancla del menú de museos (versión md).
   * @type {HTMLElement|null}
   */
  const [anclaMenuMuseos, setAnclaMenuMuseos] = React.useState(null);
  /**
   * Estado para el ancla del menú de salas (versión md).
   * @type {HTMLElement|null}
   */
  const [anclaMenuSalas, setAnclaMenuSalas] = React.useState(null);
  /**
   * Estado para el ancla del menú hamburguesa (versión xs).
   * @type {HTMLElement|null}
   */
  const [anclaMenuXS, setAnclaMenuXS] = React.useState(null);

  /**
   * Abre el menú de museos (md) anclándolo al botón correspondiente.
   * @param {React.MouseEvent} event
   */
  const handleClickMenuMuseos = (event) => {
    setAnclaMenuMuseos(event.currentTarget);
  };

  /**
   * Abre el menú de salas (md) anclándolo al botón correspondiente.
   * @param {React.MouseEvent} event
   */
  const handleClickMenuSalas = (event) => {
    setAnclaMenuSalas(event.currentTarget);
  };

  /**
   * Abre el menú hamburguesa (xs) anclándolo al botón correspondiente.
   * @param {React.MouseEvent} event
   */
  const handleClickMenuXS = (event) => {
    setAnclaMenuXS(event.currentTarget);
  };

  /**
   * Cierra todos los menús de navegación.
   */
  const handleCloseNavMenu = () => {
    setAnclaMenuMuseos(null);
    setAnclaMenuSalas(null);
    setAnclaMenuXS(null);
  };

  // Estilo para los enlaces de navegación
  const linkStyle = { color: "black", textDecoration: "none" };

  // Renderiza la barra de navegación con menús responsivos y enlaces a las distintas páginas
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Menú para resolución xs  */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu gestion cultural resolucion xs"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleClickMenuXS}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar-xs"
              anchorEl={anclaMenuXS}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anclaMenuXS)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <ListSubheader>Menú Museos</ListSubheader>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/museums/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Alta de museos</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/museums" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Listado de museos</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/museums/buscar" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Busqueda de museos</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/museums/buscar-fecha" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Busqueda de museos por fecha</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/museums/graph" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Gráfica de museos</Typography>
                </Link>
              </MenuItem>
              <Divider />
              <ListSubheader>Menú Salas</ListSubheader>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/rooms/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Alta de salas</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/rooms" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Listado de salas</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/rooms/buscar" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Busqueda de salas</Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo y nombre de la web */}
          <MuseumIcon />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mx: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            GESTION CULTURAL
          </Typography>

          {/* Menú para resolución md */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {/* Menú para museos en md */}
            <Button onClick={handleClickMenuMuseos} sx={{ my: 2, color: "white", display: "block" }}>
              Museos
            </Button>
            <Menu
              id="menu-museos"
              anchorEl={anclaMenuMuseos}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anclaMenuMuseos)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/museums/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Alta de museos</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/museums" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Listado de museos</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/museums/buscar" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Busqueda de museos</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/museums/buscar-fecha" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Busqueda de museos por fecha</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/museums/graph" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Gráfica de museos</Typography>
                </Link>
              </MenuItem>
            </Menu>
            {/* Menú para salas en md */}
            <Button onClick={handleClickMenuSalas} sx={{ my: 2, color: "white", display: "block" }}>
              Salas
            </Button>
            <Menu
              id="menu-salas"
              anchorEl={anclaMenuSalas}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anclaMenuSalas)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/rooms/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Alta de salas</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/rooms" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Listado de salas</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/rooms/buscar" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>Busqueda de salas</Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
