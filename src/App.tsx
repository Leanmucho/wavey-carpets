import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { CartProvider } from "./context/CartContext"; // Importar el CartProvider
import Header from "./components/Header";
import Home from "./components/Home";
import Shop from "./components/Shop";
import Colecciones from "./components/Colecciones";
import ProductPage from "./components/ProductPage";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import SearchResults from "./components/SearchResults";
import InfoPage from "./components/InfoPage"; // ← NUEVO
import Carrito from "./components/Carrito"; // ← Importa Carrito
import "./App.css";

function App() {
  return (
    <CartProvider> {/* Envuelve toda la aplicación en CartProvider */}
      <Router>
        <Header />
        <Box>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/colecciones" element={<Colecciones />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/buscar" element={<SearchResults />} />
            <Route path="/info" element={<InfoPage />} /> {/* NUEVO */}
            <Route path="/carrito" element={<Carrito />} /> {/* Ruta del carrito */}
          </Routes>
        </Box>
      </Router>
    </CartProvider> // Asegúrate de envolver la app dentro del CartProvider
  );
}

export default App;
