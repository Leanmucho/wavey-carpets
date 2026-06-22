import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { retroPalette } from "../style/theme";

const Carrito = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    clearCart,
    getCartTotal,
    removeItemFromCart,
    updateItemQuantity,
  } = useCart();

  return (
    <Box component="main" sx={{ minHeight: "80vh", pt: { xs: 14, md: 16 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "end" }}
          spacing={2}
          mb={4}
        >
          <Box>
            <Typography variant="h2" component="h1">
              Carrito
            </Typography>
            <Typography color="text.secondary">
              Tu seleccion de piezas listas para encargar.
            </Typography>
          </Box>
          {cartItems.length > 0 && (
            <Button variant="outlined" onClick={clearCart} sx={{ bgcolor: retroPalette.paper }}>
              Vaciar carrito
            </Button>
          )}
        </Stack>

        {cartItems.length === 0 ? (
          <Stack
            spacing={3}
            sx={{
              bgcolor: "background.paper",
              border: `2px solid ${retroPalette.border}`,
              boxShadow: "8px 8px 0 rgba(25,23,20,0.18)",
              p: { xs: 3, md: 5 },
              textAlign: "center",
            }}
          >
            <Typography variant="h4">Tu carrito esta vacio</Typography>
            <Button variant="contained" onClick={() => navigate("/shop")}>
              Ver productos
            </Button>
          </Stack>
        ) : (
          <Stack spacing={3}>
            {cartItems.map((item) => (
              <Card key={item.id} sx={{ display: { xs: "block", md: "flex" }, overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.name}
                  sx={{
                    width: { xs: "100%", md: 220 },
                    height: { xs: 220, md: "auto" },
                    objectFit: "cover",
                    borderRight: { md: `2px solid ${retroPalette.border}` },
                    borderBottom: { xs: `2px solid ${retroPalette.border}`, md: 0 },
                  }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="h5">{item.name}</Typography>
                      <Typography color="text.secondary">{item.description}</Typography>
                      <Typography variant="h6" sx={{ mt: 1, color: retroPalette.olive }}>
                        ${item.price.toFixed(2)}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconButton
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        aria-label="Restar"
                      >
                        <Remove />
                      </IconButton>
                      <Typography fontWeight={900}>{item.quantity}</Typography>
                      <IconButton
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        aria-label="Sumar"
                      >
                        <Add />
                      </IconButton>
                      <IconButton onClick={() => removeItemFromCart(item.id)} aria-label="Eliminar">
                        <Delete color="error" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="flex-end"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={2}
            >
              <Typography variant="h4">Total: ${getCartTotal().toFixed(2)}</Typography>
              <Button variant="contained" onClick={() => navigate("/checkout")}>
                Proceder al pago
              </Button>
            </Stack>
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default Carrito;
