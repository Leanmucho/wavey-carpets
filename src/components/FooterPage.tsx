import { Box, Container, Grid, IconButton, Link, Stack, Typography } from "@mui/material";
import { Facebook, Instagram, WhatsApp } from "@mui/icons-material";
import { retroPalette } from "../style/theme";

const FooterPage = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: retroPalette.ink,
        color: retroPalette.paper,
        borderTop: `5px solid ${retroPalette.red}`,
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" sx={{ color: retroPalette.mustard }} gutterBottom>
              Wavy Carpets
            </Typography>
            <Typography>
              Alfombras tufting con estetica vintage, callejera y hecha a mano.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" sx={{ color: retroPalette.mustard }}>
              Contacto
            </Typography>
            <Typography>
              <Link href="mailto:contacto@wavycarpets.com" color="inherit">
                contacto@wavycarpets.com
              </Link>
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <IconButton color="inherit" href="https://www.instagram.com" target="_blank">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" href="https://www.facebook.com" target="_blank">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" href="https://wa.me/1234567890" target="_blank">
                <WhatsApp />
              </IconButton>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" sx={{ color: retroPalette.mustard }}>
              Taller
            </Typography>
            <Typography>Lunes a viernes: 9 a 18 hs</Typography>
            <Typography>Sabado: 10 a 14 hs</Typography>
            <Typography>General Rodríguez, Argentina</Typography>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 4, color: "rgba(255,248,236,0.75)" }}>
          © {new Date().getFullYear()} Wavy Carpets. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default FooterPage;
