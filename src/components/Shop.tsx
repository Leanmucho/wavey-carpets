import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Container,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Alert,
  Stack,
  Typography,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Star,
  Tune,
  ViewList,
  ViewModule,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { retroPalette } from "../style/theme";

import { useCatalog } from "../context/useCatalog";

const itemsPerPage = 8;

const Shop = () => {
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const { products, loading, error, retry } = useCatalog();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const allMaterials = useMemo(
    () => Array.from(new Set(products.flatMap((product) => product.materials))),
    [products]
  );

  const filteredProducts = products.filter((product) => {
    if (selectedMaterials.length === 0) return true;
    return selectedMaterials.some((material) => product.materials.includes(material));
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
        return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
      default:
        return 0;
    }
  });

  const pageCount = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((selected) => selected !== material)
        : [...prev, material]
    );
    setCurrentPage(1);
  };

  return (
    <Box component="main" sx={{ minHeight: "100vh", pt: { xs: 13, md: 15 }, pb: 8 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            minHeight: 280,
            bgcolor: retroPalette.paper,
            border: `3px solid ${retroPalette.border}`,
            boxShadow: "10px 10px 0 rgba(25,23,20,0.18)",
            p: { xs: 3, md: 6 },
            mb: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
            overflow: "hidden",
          }}
        >
          <Box>
            <Chip label="Catálogo de alfombras" color="primary" sx={{ mb: 2 }} />
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: "'Archivo Black', 'Work Sans', sans-serif",
                fontSize: { xs: "2.6rem", md: "4.5rem" },
                lineHeight: 0.95,
              }}
            >
              Alfombras de diseño
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2, maxWidth: 620 }}>
              Explorá alfombras hechas a mano con técnica tufting. Diseños, formas y colores para darle calidez y personalidad a tu espacio.
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: 210,
              height: 210,
              bgcolor: retroPalette.red,
              border: `3px solid ${retroPalette.border}`,
              transform: "rotate(8deg)",
              boxShadow: "8px 8px 0 rgba(25,23,20,0.25)",
            }}
          />
        </Box>

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
          mb={4}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={() => setViewMode("grid")}
              sx={{ bgcolor: viewMode === "grid" ? retroPalette.red : retroPalette.paper }}
            >
              <ViewModule sx={{ color: viewMode === "grid" ? retroPalette.paper : retroPalette.ink }} />
            </IconButton>
            <IconButton
              onClick={() => setViewMode("list")}
              sx={{ bgcolor: viewMode === "list" ? retroPalette.red : retroPalette.paper }}
            >
              <ViewList sx={{ color: viewMode === "list" ? retroPalette.paper : retroPalette.ink }} />
            </IconButton>
            <Button startIcon={<Tune />} variant="outlined" onClick={() => setDrawerOpen(true)}>
              Filtros
            </Button>
          </Stack>

          <FormControl sx={{ minWidth: 210 }} size="small">
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={sortOption}
              label="Ordenar por"
              onChange={(event) => {
                setSortOption(event.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="featured">Destacados</MenuItem>
              <MenuItem value="price-asc">Precio: menor a mayor</MenuItem>
              <MenuItem value="price-desc">Precio: mayor a menor</MenuItem>
              <MenuItem value="rating">Mejor valorados</MenuItem>
              <MenuItem value="newest">Más nuevos</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {loading && <Box role="status" aria-label="Cargando alfombras" aria-live="polite"><Typography sx={{ mb: 2 }}>Cargando alfombras…</Typography><Grid container spacing={4}>{Array.from({ length: 8 }, (_, index) => <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}><Skeleton variant="rectangular" height={250} /><Skeleton height={40} /><Skeleton width="65%" height={28} /></Grid>)}</Grid></Box>}
        {!loading && error && <Alert severity="warning" action={<Button color="inherit" onClick={retry}>Reintentar</Button>}>No pudimos cargar las alfombras. Intentá nuevamente.</Alert>}
        {!loading && !error && sortedProducts.length === 0 && <Typography role="status">{products.length ? "No hay alfombras con estos filtros." : "Todavía no hay alfombras publicadas. Podés solicitar un diseño a medida."}</Typography>}
        <Grid container spacing={4} aria-busy={loading}>
          {!loading && paginatedProducts.map((product) => (
            <Grid
              key={product.id}
              size={{
                xs: 12,
                sm: viewMode === "grid" ? 6 : 12,
                md: viewMode === "grid" ? 4 : 12,
                lg: viewMode === "grid" ? 3 : 12,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: viewMode === "list" ? "flex" : "block",
                  overflow: "hidden",
                  transition: "transform 180ms ease",
                  "&:hover": {
                    transform: "translate(-2px, -2px)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    width: viewMode === "list" ? { xs: 140, md: 260 } : "100%",
                    height: viewMode === "list" ? 230 : 250,
                    objectFit: "cover",
                    borderBottom: viewMode === "grid" ? `2px solid ${retroPalette.border}` : 0,
                    borderRight: viewMode === "list" ? `2px solid ${retroPalette.border}` : 0,
                  }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="start" gap={2}>
                    <Box>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.description}
                      </Typography>
                    </Box>
                    <IconButton onClick={() => toggleFavorite(product.id)} aria-label="Favorito">
                      {favorites.includes(product.id) ? (
                        <Favorite sx={{ color: retroPalette.red }} />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={0.5} my={1.5}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        fontSize="small"
                        sx={{ color: index < Math.round(product.rating) ? retroPalette.mustard : "#c8bda9" }}
                      />
                    ))}
                    <Typography variant="caption">({product.rating})</Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Typography variant="h5" sx={{ color: retroPalette.olive }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                    {product.oldPrice && (
                      <Typography variant="body2" sx={{ textDecoration: "line-through" }}>
                        ${product.oldPrice.toFixed(2)}
                      </Typography>
                    )}
                    {product.oldPrice && (
                      <Chip
                        label={`${Math.round((1 - product.price / product.oldPrice) * 100)}% OFF`}
                        color="primary"
                        size="small"
                      />
                    )}
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={() => addItemToCart(product)}>
                      Agregar
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ bgcolor: retroPalette.paper }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      Ver detalles
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {!loading && !error && sortedProducts.length > 0 && <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={(_event, value) => setCurrentPage(value)}
          />
        </Box>}
      </Container>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, p: 3, bgcolor: retroPalette.cream, height: "100%" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Material
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
