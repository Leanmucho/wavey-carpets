import { HashRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Home from "./components/Home";
import Shop from "./components/Shop";
import ProductPage from "./components/ProductPage";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import SearchResults from "./components/SearchResults";
import InfoPage from "./components/InfoPage";
import Carrito from "./components/Carrito";
import FooterPage from "./components/FooterPage";
import AdminProducts from "./components/AdminProducts";
import Checkout from "./components/Checkout";
import CustomOrder from "./components/CustomOrder";
import "./App.css";

const SimplePage = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => {
  const navigate = useNavigate();

  return (
    <Box
      component="main"
      sx={{
        minHeight: "70vh",
        pt: { xs: 14, md: 16 },
        px: 2,
        display: "grid",
        placeItems: "center",
      }}
    >
      <Stack
        spacing={3}
        sx={{
          maxWidth: 620,
          p: { xs: 3, md: 5 },
          bgcolor: "background.paper",
          border: "2px solid",
          borderColor: "text.primary",
          boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" component="h1">
          {title}
        </Typography>
        <Typography color="text.secondary">{message}</Typography>
        <Button variant="contained" onClick={() => navigate("/shop")}>
          Ver productos
        </Button>
      </Stack>
    </Box>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buscar" element={<SearchResults />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/admin" element={<AdminProducts />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/personalizada" element={<CustomOrder />} />
          <Route
            path="/mi-cuenta"
            element={
              <SimplePage
                title="Mi cuenta"
                message="Aca va el perfil del usuario, direcciones y datos de contacto."
              />
            }
          />
          <Route
            path="/pedidos"
            element={
              <SimplePage
                title="Mis pedidos"
                message="Aca se listaran las compras cuando exista el flujo de pedidos."
              />
            }
          />
        </Routes>
        <FooterPage />
      </Router>
    </CartProvider>
  );
}

export default App;
