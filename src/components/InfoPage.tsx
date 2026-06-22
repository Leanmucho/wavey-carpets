import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import img1 from "../assets/personalizadas.jpg";
import img2 from "../assets/en-stock.jpg";
import img3 from "../assets/detalles.jpg";
import img4 from "../assets/patagonia.jpg";
import { retroPalette } from "../style/theme";

const InfoPage = () => {
  return (
    <Box component="main" sx={{ pt: { xs: 14, md: 16 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center" textAlign="center" mb={6}>
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontFamily: "'Archivo Black', 'Work Sans', sans-serif" }}
          >
            Nosotros
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
            Fabricamos alfombras con tecnica tufting, mezcla de oficio artesanal y grafica urbana. Cada pieza nace desde cero y busca transformar un espacio sin hacerlo solemne.
          </Typography>
        </Stack>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {[img1, img2].map((image, index) => (
            <Grid key={image} size={{ xs: 12, md: 6 }}>
              <motion.img
                src={image}
                alt={index === 0 ? "Alfombras personalizadas" : "Alfombras en stock"}
                style={{
                  width: "100%",
                  border: `3px solid ${retroPalette.border}`,
                  boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
                  display: "block",
                }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.25 }}
              />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={5} alignItems="center" sx={{ mb: 7 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h3" sx={{ color: retroPalette.red, mb: 2 }}>
              Detalles
            </Typography>
            <Typography color="text.secondary">
              El reverso tambien importa: define durabilidad, caida y comodidad. Usamos materiales pensados para que la alfombra se vea fuerte y se sienta bien todos los dias.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.img
              src={img3}
              alt="Detalles de las alfombras"
              style={{
                width: "100%",
                border: `3px solid ${retroPalette.border}`,
                boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
                display: "block",
              }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.25 }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={5} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.img
              src={img4}
              alt="Taller en la Patagonia"
              style={{
                width: "100%",
                border: `3px solid ${retroPalette.border}`,
                boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
                display: "block",
              }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.25 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h3" sx={{ color: retroPalette.red, mb: 2 }}>
              Desde la Patagonia
            </Typography>
            <Typography color="text.secondary">
              El taller esta en Bariloche. La calma del sur y la energia de la calle se mezclan en piezas con color, textura y personalidad.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InfoPage;
