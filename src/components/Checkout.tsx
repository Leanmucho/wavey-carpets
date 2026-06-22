import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";
import type { CartItem } from "../types";
import { retroPalette } from "../style/theme";

const WHATSAPP_PHONE = "1234567890";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  notes: "",
};

type CheckoutForm = typeof initialForm;

interface OrderSnapshot {
  id?: string;
  customer: CheckoutForm;
  items: CartItem[];
  total: number;
  whatsappUrl: string;
}

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const buildWhatsAppMessage = (
  customer: CheckoutForm,
  items: CartItem[],
  total: number,
  orderId?: string
) => {
  const productLines = items
    .map(
      (item) =>
        `- ${item.name} x${item.quantity} (${money.format(item.price * item.quantity)})`
    )
    .join("\n");

  return [
    "Hola Wavy Carpets, quiero confirmar este pedido:",
    orderId ? `Pedido: ${orderId}` : "",
    productLines,
    `Total: ${money.format(total)}`,
    "",
    `Nombre: ${customer.name}`,
    `Email: ${customer.email}`,
    `Telefono: ${customer.phone}`,
    `Direccion: ${customer.address}`,
    `Ciudad: ${customer.city}`,
    customer.notes ? `Notas: ${customer.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
};

const buildWhatsAppUrl = (
  customer: CheckoutForm,
  items: CartItem[],
  total: number,
  orderId?: string
) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    buildWhatsAppMessage(customer, items, total, orderId)
  )}`;

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, getCartTotal } = useCart();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderSnapshot | null>(null);

  const total = getCartTotal();
  const whatsappUrl = useMemo(
    () => buildWhatsAppUrl(form, cartItems, total),
    [cartItems, form, total]
  );

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    if (cartItems.length === 0) return "Tu carrito esta vacio.";
    if (!form.name.trim()) return "Completa tu nombre.";
    if (!form.email.trim()) return "Completa tu email.";
    if (!form.phone.trim()) return "Completa tu telefono.";
    if (!form.address.trim()) return "Completa tu direccion.";
    if (!form.city.trim()) return "Completa tu ciudad.";
    return "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const orderItems = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const orderRef = await addDoc(collection(db, "orders"), {
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          notes: form.notes.trim(),
        },
        items: orderItems,
        total,
        status: "pending",
        source: "web-checkout",
        userId: user?.uid ?? null,
        createdAt: serverTimestamp(),
      });

      setOrder({
        id: orderRef.id,
        customer: form,
        items: cartItems,
        total,
        whatsappUrl: buildWhatsAppUrl(form, cartItems, total, orderRef.id),
      });
      clearCart();
    } catch {
      setError(
        "No pudimos guardar el pedido en Firebase. Podes enviarlo por WhatsApp con el boton de abajo."
      );
    } finally {
      setSaving(false);
    }
  };

  if (order) {
    return (
      <Box component="main" sx={{ minHeight: "78vh", pt: { xs: 14, md: 16 }, pb: 8 }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              bgcolor: retroPalette.paper,
              border: `3px solid ${retroPalette.border}`,
              boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h2" component="h1">
                Pedido recibido
              </Typography>
              <Alert severity="success">
                Guardamos tu pedido {order.id ? `#${order.id}` : ""}. Te recomendamos enviarlo por WhatsApp para coordinar pago y envio.
              </Alert>
              <Typography variant="h5">Total: {money.format(order.total)}</Typography>
              <Button variant="contained" href={order.whatsappUrl} target="_blank">
                Enviar por WhatsApp
              </Button>
              <Button variant="outlined" onClick={() => navigate("/shop")}>
                Volver a productos
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ minHeight: "100vh", pt: { xs: 14, md: 16 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h2" component="h1">
            Checkout
          </Typography>
          <Typography color="text.secondary">
            Revisa tu pedido y dejanos tus datos para coordinar pago, envio y detalles finales.
          </Typography>
        </Stack>

        <Grid container spacing={4} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: retroPalette.paper,
                border: `3px solid ${retroPalette.border}`,
                boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
              }}
            >
              <Stack spacing={2.5}>
                <Typography variant="h4">Datos de entrega</Typography>
                {error && <Alert severity="warning">{error}</Alert>}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Nombre"
                      fullWidth
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Telefono"
                      fullWidth
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Ciudad"
                      fullWidth
                      value={form.city}
                      onChange={(event) => updateField("city", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Direccion"
                      fullWidth
                      value={form.address}
                      onChange={(event) => updateField("address", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Notas"
                      fullWidth
                      multiline
                      minRows={3}
                      value={form.notes}
                      onChange={(event) => updateField("notes", event.target.value)}
                    />
                  </Grid>
                </Grid>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button type="submit" variant="contained" disabled={saving || cartItems.length === 0}>
                    {saving ? "Confirmando..." : "Confirmar pedido"}
                  </Button>
                  <Button
                    variant="outlined"
                    href={whatsappUrl}
                    target="_blank"
                    sx={{ bgcolor: retroPalette.paper }}
                    disabled={cartItems.length === 0}
                  >
                    Enviar por WhatsApp
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: retroPalette.paper,
                border: `3px solid ${retroPalette.border}`,
                boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
              }}
            >
              <Stack spacing={2.5}>
                <Typography variant="h4">Resumen</Typography>
                {cartItems.length === 0 ? (
                  <Stack spacing={2}>
                    <Typography color="text.secondary">No hay productos en el carrito.</Typography>
                    <Button variant="contained" onClick={() => navigate("/shop")}>
                      Ver productos
                    </Button>
                  </Stack>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <Card key={item.id} sx={{ display: "flex", overflow: "hidden" }}>
                        <CardMedia
                          component="img"
                          image={item.image}
                          alt={item.name}
                          sx={{
                            width: 96,
                            objectFit: "cover",
                            borderRight: `2px solid ${retroPalette.border}`,
                          }}
                        />
                        <CardContent sx={{ flex: 1 }}>
                          <Typography fontWeight={900}>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.quantity} x {money.format(item.price)}
                          </Typography>
                          <Typography fontWeight={900}>
                            {money.format(item.price * item.quantity)}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h5">Total</Typography>
                      <Typography variant="h5" sx={{ color: retroPalette.olive }}>
                        {money.format(total)}
                      </Typography>
                    </Stack>
                  </>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Checkout;
