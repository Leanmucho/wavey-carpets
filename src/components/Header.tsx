import { useState } from "react";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AccountCircle,
  Close,
  Menu as MenuIcon,
  Search,
  ShoppingBag,
} from "@mui/icons-material";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/wavyCarpetPNG.png";
import { auth } from "../firebaseConfig";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";
import { retroPalette } from "../style/theme";

const navItems = [
  { label: "Inicio", path: "/" },
  { label: "Productos", path: "/shop" },
  { label: "Personalizada", path: "/personalizada" },
  { label: "Colecciones", path: "/colecciones" },
  { label: "Info", path: "/info" },
];

const Header = () => {
  const [anchorElCart, setAnchorElCart] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const { cartItems, getCartCount, getCartTotal } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const goTo = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    setAnchorElCart(null);
    setAnchorElUser(null);
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && search.trim()) {
      goTo(`/buscar?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setAnchorElUser(null);
    navigate("/");
  };

  const navLinks = (
    <Stack
      direction={isMobile ? "column" : "row"}
      spacing={isMobile ? 1 : 3}
      sx={{ alignItems: isMobile ? "stretch" : "center" }}
    >
      {navItems.map((item) => (
        <Button
          key={item.path}
          color="inherit"
          onClick={() => goTo(item.path)}
          sx={{
            boxShadow: "none",
            border: "0",
            color: retroPalette.ink,
            px: 1,
            justifyContent: isMobile ? "flex-start" : "center",
            "&:hover": {
              boxShadow: "none",
              color: retroPalette.red,
              transform: "none",
              backgroundColor: "transparent",
            },
          }}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: retroPalette.cream,
        color: retroPalette.ink,
        borderBottom: `3px solid ${retroPalette.border}`,
      }}
    >
      <Toolbar sx={{ minHeight: 76, gap: 2 }}>
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
            <MenuIcon />
          </IconButton>
        )}

        <Box
          onClick={() => goTo("/")}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            minWidth: { xs: 70, md: 120 },
          }}
        >
          <Box component="img" src={logo} alt="Wavy Carpets" sx={{ height: 58 }} />
        </Box>

        {!isMobile && (
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            {navLinks}
          </Box>
        )}

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: "auto" }}>
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: retroPalette.paper,
                border: `2px solid ${retroPalette.border}`,
                borderRadius: 1.5,
                px: 1.5,
                py: 0.5,
                boxShadow: "3px 3px 0 rgba(25,23,20,0.2)",
              }}
            >
              <Search sx={{ mr: 1, color: retroPalette.red }} />
              <InputBase
                placeholder="Buscar alfombra"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={handleSearch}
                sx={{ width: 190, fontWeight: 700 }}
              />
            </Box>
          )}

          <IconButton onClick={(event) => setAnchorElCart(event.currentTarget)}>
            <Badge badgeContent={getCartCount()} color="primary">
              <ShoppingBag />
            </Badge>
          </IconButton>

          <IconButton onClick={(event) => setAnchorElUser(event.currentTarget)}>
            <AccountCircle />
          </IconButton>
        </Stack>
      </Toolbar>

      <Box sx={{ height: 5, bgcolor: retroPalette.red }} />

      <Menu
        anchorEl={anchorElCart}
        open={Boolean(anchorElCart)}
        onClose={() => setAnchorElCart(null)}
      >
        {cartItems.length === 0
          ? [
              <MenuItem key="empty" disabled>
                Tu carrito esta vacio
              </MenuItem>,
            ]
          : cartItems.slice(0, 4).map((item) => (
              <MenuItem key={item.id} onClick={() => goTo("/carrito")}>
                <Box>
                  <Typography fontWeight={800}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.quantity} x ${item.price.toFixed(2)}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
        <Divider />
        <MenuItem onClick={() => goTo("/carrito")}>
          Ver carrito - ${getCartTotal().toFixed(2)}
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={() => setAnchorElUser(null)}
      >
        {user
          ? [
              <MenuItem key="admin" onClick={() => goTo("/admin")}>
                Admin productos
              </MenuItem>,
              <MenuItem key="account" onClick={() => goTo("/mi-cuenta")}>
                Mi cuenta
              </MenuItem>,
              <MenuItem key="orders" onClick={() => goTo("/pedidos")}>
                Mis pedidos
              </MenuItem>,
              <Divider key="divider" />,
              <MenuItem key="logout" onClick={handleLogout}>
                Cerrar sesion
              </MenuItem>,
            ]
          : [
              <MenuItem key="login" onClick={() => goTo("/login")}>
                Login
              </MenuItem>,
              <MenuItem key="register" onClick={() => goTo("/register")}>
                Register
              </MenuItem>,
            ]}
      </Menu>

      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, p: 2, bgcolor: retroPalette.cream, height: "100%" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Box component="img" src={logo} alt="Wavy Carpets" sx={{ height: 54 }} />
            <IconButton onClick={() => setMobileOpen(false)} aria-label="Cerrar menu">
              <Close />
            </IconButton>
          </Stack>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: retroPalette.paper,
              border: `2px solid ${retroPalette.border}`,
              borderRadius: 1.5,
              px: 1.5,
              py: 0.5,
              mb: 3,
            }}
          >
            <Search sx={{ mr: 1, color: retroPalette.red }} />
            <InputBase
              placeholder="Buscar"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleSearch}
            />
          </Box>
          {navLinks}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
