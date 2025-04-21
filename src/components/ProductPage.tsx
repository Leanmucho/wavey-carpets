import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  CardMedia,
  Stack,
  Chip,
  Rating,
  useTheme,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Importando la configuración de Firebase

const ProductPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const { addItemToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id!); // Referencia al documento de Firestore
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const newItem = {
      id,
      name: product.name,
      price: product.price,
      quantity: 1,
    };
    addItemToCart(newItem);
  };

  if (loading) {
    return (
      <Box sx={{ pt: 20, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ pt: 20, textAlign: 'center' }}>
        <Typography variant="h4">Producto no encontrado</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, minHeight: '100vh', pt: { xs: 16, md: 20 }, pb: 10, px: { xs: 2, md: 6 } }}>
      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} md={6}>
          <CardMedia component="img" image={product.image} alt={product.name} sx={{ width: '100%', height: 500, objectFit: 'cover', borderRadius: 4, boxShadow: 4 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            {product.name}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Rating value={product.rating || 0} readOnly precision={0.5} />
            <Typography variant="body2">({product.rating || 0})</Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Typography variant="h4" sx={{ color: theme.palette.secondary.main }}>
              ${product.price?.toFixed(2)}
            </Typography>
            {product.oldPrice && (
              <>
                <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'gray' }}>
                  ${product.oldPrice?.toFixed(2)}
                </Typography>
                <Chip label={`-${Math.round((1 - product.price / product.oldPrice) * 100)}%`} size="small" sx={{ bgcolor: theme.palette.primary.main, color: 'white' }} />
              </>
            )}
          </Stack>

          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              borderRadius: 3,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: 3,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
            onClick={handleAddToCart}
          >
            Añadir al carrito
          </Button>

          {/* Especificaciones */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom>
            Especificaciones
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>Material: {product.material || 'Algodón reciclado'}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>Tamaño: {product.size || '120x180 cm'}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>Origen: {product.origin || 'Hecho en Argentina'}</Typography>

          {/* Etiquetas */}
          {product.tags?.length > 0 && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h6" gutterBottom>Etiquetas</Typography>
              <Stack direction="row" spacing={1} mb={3}>
                {product.tags.map((tag: string, idx: number) => (
                  <Chip
                    key={idx}
                    label={tag}
                    variant="outlined"
                    sx={{ borderColor: theme.palette.secondary.main, color: theme.palette.secondary.main }}
                  />
                ))}
              </Stack>
            </>
          )}

          {/* Info adicional */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom>
            Envíos y devoluciones
          </Typography>
          <Typography variant="body2">
            Envíos a todo el país en 3 a 7 días hábiles. Cambios sin costo dentro de los 10 días posteriores a la recepción.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductPage;
