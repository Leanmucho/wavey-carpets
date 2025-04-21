import React, { useState, useEffect } from "react";
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
  IconButton,
  Stack,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Drawer,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Fade,
} from "@mui/material";
import { FavoriteBorder, Favorite, Star, Tune, ViewModule, ViewList } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  isNew: boolean;
  materials: string[];
  image: string;
};

const Shop = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState<string>("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(items);
    };
    fetchProducts();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
    setCurrentPage(1);
  };

  const addToCart = (product: Product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Actualizar el carrito en el almacenamiento local
  };

  const allMaterials = Array.from(new Set(products.flatMap((p) => p.materials)));

  const filteredProducts = products.filter((product) => {
    if (selectedMaterials.length === 0) return true;
    return selectedMaterials.some((mat) => product.materials.includes(mat));
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return 0;
    }
  });

  const itemsPerPage = 8;
  const pageCount = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        pt: { xs: 12, md: 15 },
        pb: 8,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            height: 300,
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            mb: 6,
            color: "white",
          }}
        >
          <Box textAlign="center">
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Nuestra Tienda
            </Typography>
            <Typography variant="h5">
              Alfombras Tufting hechas a mano con tradición y arte
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={() => setViewMode("grid")}
              sx={{
                bgcolor: viewMode === "grid" ? "#D62246" : "transparent",
                color:
                  viewMode === "grid"
                    ? "white"
                    : theme.palette.text.primary,
              }}
            >
              <ViewModule />
            </IconButton>
            <IconButton
              onClick={() => setViewMode("list")}
              sx={{
                bgcolor: viewMode === "list" ? "#D62246" : "transparent",
                color:
                  viewMode === "list"
                    ? "white"
                    : theme.palette.text.primary,
              }}
            >
              <ViewList />
            </IconButton>
            <Button
              startIcon={<Tune />}
              variant="outlined"
              onClick={() => setDrawerOpen(true)}
              sx={{
                borderColor: "#1A1A1A",
                color: "#1A1A1A",
                ":hover": {
                  backgroundColor: "#FFD166",
                  borderColor: "#1A1A1A",
                },
              }}
            >
              Filtros
            </Button>
          </Box>

          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={sortOption}
              label="Ordenar por"
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="featured">Destacados</MenuItem>
              <MenuItem value="price-asc">Precio: Menor a Mayor</MenuItem>
              <MenuItem value="price-desc">Precio: Mayor a Menor</MenuItem>
              <MenuItem value="rating">Mejor Valorados</MenuItem>
              <MenuItem value="newest">Más Nuevos</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={4}>
          {paginatedProducts.map((product) => (
            <Grid
              item
              key={product.id}
              xs={12}
              sm={viewMode === "grid" ? 6 : 12}
              md={viewMode === "grid" ? 4 : 12}
              lg={viewMode === "grid" ? 3 : 12}
            >
              <Fade in timeout={600}>
                <Card
                  sx={{
                    display: viewMode === "list" ? "flex" : "block",
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 4,
                    boxShadow: 5,
                    transition: "transform 0.3s",
                    ":hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      width: viewMode === "list" ? 200 : "100%",
                      height: viewMode === "list" ? 200 : 240,
                      objectFit: "cover",
                    }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" sx={{ color: "#1A1A1A" }}>
                        {product.name}
                      </Typography>
                      <IconButton onClick={() => toggleFavorite(product.id)}>
                        {favorites.includes(product.id) ? (
                          <Favorite sx={{ color: "#D62246" }} />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.description}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          fontSize="small"
                          sx={{ color: i < product.rating ? "#FFD166" : "#ccc" }}
                        />
                      ))}
                      <Typography variant="caption">({product.rating})</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" sx={{ color: "#4F772D" }}>
                        ${product.price.toFixed(2)}
                      </Typography>
                      {product.oldPrice && (
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: "line-through",
                            color: "gray",
                          }}
                        >
                          ${product.oldPrice.toFixed(2)}
                        </Typography>
                      )}
                      {product.oldPrice && (
                        <Chip
                          label={`${Math.round(
                            (1 - product.price / product.oldPrice) * 100
                          )}% OFF`}
                          size="small"
                          sx={{ bgcolor: "#D62246", color: "white" }}
                        />
                      )}
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#D62246",
                          ":hover": {
                            backgroundColor: "#B91C35",
                          },
                          transition: "transform 0.3s",
                          ":hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                        onClick={() => addToCart(product)}
                      >
                        Añadir al Carrito
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#1A1A1A",
                          color: "#1A1A1A",
                          ":hover": {
                            backgroundColor: "#FFD166",
                            borderColor: "#1A1A1A",
                          },
                        }}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        Ver Detalles
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#1A1A1A",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#D62246",
                color: "white",
              },
            }}
          />
        </Box>
      </Container>

      {/* Filtro lateral */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ zIndex: 1200 }}
      >
        <Box sx={{ width: 250, padding: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filtrar por Material
          </Typography>
          <FormGroup>
            {allMaterials.map((material) => (
              <FormControlLabel
                key={material}
                control={
                  <Checkbox
                    checked={selectedMaterials.includes(material)}
                    onChange={() => toggleMaterial(material)}
                  />
                }
                label={material}
              />
            ))}
          </FormGroup>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Shop;
