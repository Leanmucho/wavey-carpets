import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/wavyCarpetPNG.png";
import { useEffect, useState } from "react";

// Puedes reemplazar estas rutas con imágenes reales de tu proyecto
const images = [
  "/assets/banner1.jpg",
  "/assets/banner2.jpg",
  "/assets/banner3.jpg"
];

const Home = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#F0E6D2"
      }}
    >
      {/* Carrusel */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundImage: `url(${images[currentImage]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1s ease-in-out",
          filter: "brightness(0.5)",
          zIndex: 1,
        }}
      />

      {/* Overlay con contenido centrado */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 3,
        }}
      >
        <img
          src={logo}
          alt="Wavy Carpets Logo"
          style={{ height: "120px", marginBottom: "20px" }}
        />
        <Typography
          variant="h3"
          sx={{ color: "#FFD166", fontWeight: 700, mb: 2 }}
        >
          ¡Bienvenido a Wavy Carpets!
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "#FFFFFF", mb: 4, maxWidth: 600 }}
        >
          Alfombras únicas con un estilo irreverente, vintage y callejero.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/shop")}
          sx={{
            backgroundColor: "#D62246",
            color: "#FFF",
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: "30px",
            "&:hover": {
              backgroundColor: "#B81C3A",
            },
          }}
        >
          Ver Productos
        </Button>
      </Box>
    </Box>
  );
};

export default Home;

