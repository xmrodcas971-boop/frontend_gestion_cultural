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
import MuseumIcon from '@mui/icons-material/Museum';

function Navbar() {
  const [anclaMenuMuseos, setAnclaMenuMuseos] = React.useState(null);
  const [anclaMenuSalas, setAnclaMenuSalas] = React.useState(null);
  const [anclaMenuXS, setAnclaMenuXS] = React.useState(null);

  const handleClickMenuMuseos = (event) => {
    setAnclaMenuMuseos(event.currentTarget);
  };

  const handleClickMenuSalas = (event) => {
    setAnclaMenuSalas(event.currentTarget);
  };

  const handleClickMenuXS = (event) => {
    setAnclaMenuXS(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnclaMenuMuseos(null);
    setAnclaMenuSalas(null);
    setAnclaMenuXS(null);
  };

  const linkStyle = { color: "black", textDecoration: "none" };

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
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de museos
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/museums" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de museos
                  </Typography>
                </Link>
              </MenuItem>
              <Divider />
              <ListSubheader>Menú Salas</ListSubheader>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/rooms/new" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de salas
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/rooms" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de salas
                  </Typography>
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
            <Button
              onClick={handleClickMenuMuseos}
              sx={{ my: 2, color: "white", display: "block" }}
            >
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
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de museos
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/museums" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de museos
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
            {/* Menú para salas en md */}
            <Button
              onClick={handleClickMenuSalas}
              sx={{ my: 2, color: "white", display: "block" }}
            >
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
                  <Typography sx={{ textAlign: "center" }}>
                    Alta de salas
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/rooms" style={linkStyle}>
                  <Typography sx={{ textAlign: "center" }}>
                    Listado de salas
                  </Typography>
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
