import { useEffect, useState } from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { ArrowForward, AutoAwesome, Skateboarding } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/wavyCarpetPNG.png";
import { retroPalette } from "../style/theme";

const images = [
  `${import.meta.env.BASE_URL}assets/banner1.jpg`,
  `${import.meta.env.BASE_URL}assets/banner2.jpg`,
  `${import.meta.env.BASE_URL}assets/banner3.jpg`,
  `${import.meta.env.BASE_URL}assets/banner4.jpg`,
];

const Home = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        pt: { xs: 12, md: 14 },
        display: "flex",
        alignItems: "center",
        bgcolor: retroPalette.cream,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(90deg, rgba(239,228,208,0.96) 0%, rgba(239,228,208,0.82) 46%, rgba(25,23,20,0.32) 100%), url(${images[currentImage]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 700ms ease",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          right: { xs: -70, md: 80 },
          bottom: { xs: 40, md: 90 },
          width: { xs: 260, md: 420 },
          height: { xs: 72, md: 110 },
          bgcolor: retroPalette.red,
          border: `3px solid ${retroPalette.border}`,
          transform: "rotate(-8deg)",
          boxShadow: "12px 12px 0 rgba(25,23,20,0.22)",
        }}
      />

      <Stack
        spacing={3}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "min(760px, calc(100% - 32px))",
          ml: { xs: 2, md: 8 },
          mb: { xs: 4, md: 0 },
        }}
      >
        <Box component="img" src={logo} alt="Wavy Carpets" sx={{ width: 156 }} />

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip icon={<Skateboarding />} label="Tufting handmade" color="primary" />
          <Chip icon={<AutoAwesome />} label="Retro street" sx={{ bgcolor: retroPalette.mustard }} />
        </Stack>

        <Typography
          variant="h1"
          sx={{
            fontFamily: "'Archivo Black', 'Work Sans', sans-serif",
            fontSize: { xs: "3rem", sm: "4.8rem", md: "6.4rem" },
            lineHeight: 0.88,
            maxWidth: 760,
          }}
        >
          Alfombras tufting artesanales
        </Typography>

        <Typography
          variant="h5"
          sx={{
            maxWidth: 570,
            color: retroPalette.mutedInk,
            fontWeight: 700,
          }}
        >
          Piezas tufting personalizadas, hechas con hilados de lana o algodón sobre tela
          primaria y terminadas con adhesivo de látex y respaldo protector.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate("/shop")}
          >
            Ver productos
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/personalizada")}
            sx={{ bgcolor: retroPalette.olive, "&:hover": { bgcolor: retroPalette.olive } }}
          >
            Personalizar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Home;
