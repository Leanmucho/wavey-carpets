import React from "react";
// import { products, Product } from "../data/products";
import { 
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Container,
  Chip,
  Divider,
  useTheme,
  IconButton
} from "@mui/material";
import { Star, FavoriteBorder, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Datos de ejemplo para las colecciones (puedes reemplazarlos con tu API)
const collections = [
  {
    id: 1,
    name: "Vintage Persianas",
    image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?ixlib=rb-4.0.3",
    price: "€199-€599",
    rating: 4.5,
    isNew: true,
    tags: ["Limited Edition", "Handmade"]
  },
  {
    id: 2,
    name: "Boho Chic",
    image: "https://images.unsplash.com/photo-1579639782539-15cc6c0be63f?ixlib=rb-4.0.3",
    price: "€159-€449",
    rating: 4.2,
    isNew: false,
    tags: ["Eco-Friendly", "Cotton"]
  },
  {
    id: 3,
    name: "Modern Geometric",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3",
    price: "€229-€699",
    rating: 4.8,
    isNew: true,
    tags: ["Wool", "Premium"]
  },
  {
    id: 4,
    name: "Moroccan Trellis",
    image: "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?ixlib=rb-4.0.3",
    price: "€179-€549",
    rating: 4.3,
    isNew: false,
    tags: ["Traditional", "Durable"]
  }
];

const Colecciones = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [favorites, setFavorites] = React.useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.default,
      minHeight: "100vh",
      pt: 12,
      pb: 8
    }}>
      <Container maxWidth="lg">
        {/* Encabezado */}
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            component="h1"
            sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 700,
              mb: 2,
              textTransform: "uppercase",
              letterSpacing: 2
            }}
          >
            Nuestras Colecciones
          </Typography>
          <Divider sx={{ 
            width: 100, 
            height: 4, 
            backgroundColor: theme.palette.primary.main,
            margin: "0 auto",
            mb: 3
          }} />
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.text.primary,
              maxWidth: 600,
              margin: "0 auto",
              fontSize: "1.1rem"
            }}
          >
            Descubre alfombras artesanales que cuentan historias. Cada pieza es única, tejida con tradición y diseñada para espacios con alma.
          </Typography>
        </Box>

        {/* Filtros */}
        <Box sx={{ 
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 6
        }}>
          {["Todas", "Vintage", "Modernas", "Bohemias", "Limited Edition"].map((filter) => (
            <Chip
              key={filter}
              label={filter}
              clickable
              sx={{
                px: 2,
                backgroundColor: filter === "Todas" ? theme.palette.primary.main : "transparent",
                color: filter === "Todas" ? "#fff" : theme.palette.text.primary,
                border: `1px solid ${theme.palette.primary.main}`,
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                  color: "#fff"
                }
              }}
            />
          ))}
        </Box>

        {/* Grid de Colecciones */}
        <Grid container spacing={4}>
          {collections.map((collection) => (
            <Grid item key={collection.id} xs={12} sm={6} md={4} lg={3} >
              <Card sx={{ 
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 10px 20px rgba(0,0,0,0.1)`
                }
              }}>
                {/* Badge de Nuevo */}
                {collection.isNew && (
                  <Box sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 1,
                    backgroundColor: theme.palette.secondary.main,
                    color: "#fff",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: 12,
                    fontWeight: "bold"
                  }}>
                    NUEVO
                  </Box>
                )}

                {/* Imagen */}
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={collection.image}
                    alt={collection.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      color: favorites.includes(collection.id) ? theme.palette.primary.main : "#fff",
                      backgroundColor: "rgba(0,0,0,0.2)",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.3)"
                      }
                    }}
                    onClick={() => toggleFavorite(collection.id)}
                  >
                    {favorites.includes(collection.id) ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                </Box>

                {/* Contenido */}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h3"
                      sx={{ fontWeight: 600 }}
                    >
                      {collection.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Star sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {collection.rating}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {collection.price}
                  </Typography>

                  {/* Tags */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {collection.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(214, 34, 70, 0.1)",
                          color: theme.palette.primary.main,
                          fontSize: 10
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>

                {/* Botón */}
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff"
                      }
                    }}
                    onClick={() => navigate(`/producto/${collection.id}`)}
                  >
                    Ver Colección
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Banner promocional al final */}
        <Box sx={{ 
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
          p: 4,
          borderRadius: 2,
          mt: 8,
          textAlign: "center",
          backgroundImage: "linear-gradient(to right, #D62246, #FF7B9C)"
        }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            ¿Buscas algo personalizado?
          </Typography>
          <Typography sx={{ mb: 3, maxWidth: 600, margin: "0 auto" }}>
            Crea tu alfombra a medida con nuestros artesanos. Combina colores, patrones y tamaños para un diseño único.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: "#fff",
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)"
              }
            }}
          >
            Solicitar Presupuesto
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Colecciones;