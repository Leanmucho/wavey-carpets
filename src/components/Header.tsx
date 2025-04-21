import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  Typography
} from "@mui/material";
import {
  ShoppingBag,
  Search,
  AccountCircle
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/wavyCarpetPNG.png";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Header = ({ cartItems = [] }) => {
  const [anchorElCart, setAnchorElCart] = useState<null | HTMLElement>(null); // Carrito
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null); // Usuario
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuCart = (event: React.MouseEvent<HTMLElement>) => {
    // Cerrar el menú de usuario si está abierto
    setAnchorElUser(null);
    setAnchorElCart(event.currentTarget);
  };

  const handleMenuUser = (event: React.MouseEvent<HTMLElement>) => {
    // Cerrar el menú del carrito si está abierto
    setAnchorElCart(null);
    setAnchorElUser(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElCart(null);
    setAnchorElUser(null);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{ backgroundColor: "#F9F9F9", py: 1 }}>
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        {/* Logo */}
        <Box onClick={() => navigate("/")} sx={{ cursor: "pointer", ml: 1 }}>
          <img src={logo} alt="Wavy Carpets" style={{ height: 55 }} />
        </Box>

        {/* Navegación */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
            <Box
              sx={{ cursor: "pointer", fontWeight: "bold", color: "#1A1A1A" }}
              onClick={() => navigate("/")}
            >
              INICIO
            </Box>
            <Box
              sx={{ cursor: "pointer", fontWeight: "bold", color: "#1A1A1A" }}
              onClick={() => navigate("/shop")}
            >
              PRODUCTOS
            </Box>
            <Box
              sx={{ cursor: "pointer", fontWeight: "bold", color: "#1A1A1A" }}
              onClick={() => navigate("/info")}
            >
              INFORMACIÓN
            </Box>
          </Box>
        )}

        {/* Buscador + Iconos */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Search */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: "999px",
                px: 2,
                py: 0.5,
                boxShadow: 1
              }}
            >
              <Search sx={{ color: "#4F4F4F", mr: 1 }} />
              <InputBase
                placeholder="¿Qué estás buscando?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                sx={{
                  fontWeight: 600,
                  width: "200px",
                  color: "#1A1A1A"
                }}
              />
            </Box>
          )}

          {/* Carrito */}
          <IconButton onClick={handleMenuCart}>
            <Badge badgeContent={cartItems.length} color="warning">
              <ShoppingBag sx={{ color: "#1A1A1A" }} />
            </Badge>
          </IconButton>

          {/* Menú del carrito */}
          <Menu
            anchorEl={anchorElCart}
            open={Boolean(anchorElCart)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
          >
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <MenuItem key={index}>
                  <Box sx={{ display: "flex", flexDirection: "column", marginRight: "10px" }}>
                    <Typography sx={{ fontWeight: "bold" }}>{item.name}</Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: "#D62246" }}>
                      {item.price}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            ) : (
              <MenuItem>Tu carrito está vacío</MenuItem>
            )}
            <Divider />
            <MenuItem onClick={() => { navigate("/carrito"); handleClose(); }}>
              Ver carrito
            </MenuItem>
          </Menu>

          {/* Usuario */}
          <IconButton onClick={handleMenuUser}>
            <AccountCircle sx={{ color: "#1A1A1A" }} />
          </IconButton>
          <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleClose}>
            {user ? (
              <>
                <MenuItem onClick={() => { navigate("/mi-cuenta"); handleClose(); }}>Mi Cuenta</MenuItem>
                <MenuItem onClick={() => { navigate("/pedidos"); handleClose(); }}>Mis Pedidos</MenuItem>
                <Divider />
                <MenuItem onClick={() => { signOut(auth); handleClose(); }}>Cerrar Sesión</MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => { navigate("/login"); handleClose(); }}>Iniciar Sesión</MenuItem>
                <MenuItem onClick={() => { navigate("/register"); handleClose(); }}>Registrarse</MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
