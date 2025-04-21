import React from 'react';
import { Box, Typography, Link, Grid, IconButton } from '@mui/material';
import { Facebook, Instagram, WhatsApp } from '@mui/icons-material';
import { useTheme } from '@mui/system';

const FooterPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "#F4D03F", // Color mostaza cálido y vintage
        color: "#1A1A1A", // Negro suave para el texto
        py: 4,
        width: "100%", // Asegura que ocupe todo el ancho
        position: "relative", // Cambio a 'relative'
        bottom: 0, // No es necesario en este caso
        left: 0,
        mt: 4, // Añadimos margen superior para que se separe un poco del contenido
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* Contacto y Redes */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ color: "#4F772D" }}>Contacto</Typography>
          <Typography>
            <Link href="mailto:contacto@wavycarpets.com" color="inherit">contacto@wavycarpets.com</Link>
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <IconButton color="inherit" href="https://www.instagram.com" target="_blank">
              <Instagram />
            </IconButton>
            <IconButton color="inherit" href="https://www.facebook.com" target="_blank">
              <Facebook />
            </IconButton>
            <IconButton color="inherit" href="https://wa.me/1234567890" target="_blank">
              <WhatsApp />
            </IconButton>
          </Box>
        </Grid>

        {/* Horarios */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ color: "#4F772D" }}>Horarios de Atención</Typography>
          <Typography>Lunes a Viernes: 9:00 AM - 6:00 PM</Typography>
          <Typography>Sábado: 10:00 AM - 2:00 PM</Typography>
          <Typography>Domingo: Cerrado</Typography>
        </Grid>

        {/* Ubicación */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ color: "#4F772D" }}>Nuestra Ubicación</Typography>
          <Typography>Av. Principal 123, Ciudad XYZ</Typography>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" sx={{ color: "#1A1A1A" }}>
          &copy; {new Date().getFullYear()} Wavy Carpets. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default FooterPage;
