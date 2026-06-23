import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { retroPalette } from "../style/theme";
import { getFirebaseErrorMessage } from "../utils/firebaseError";

const WHATSAPP_PHONE = "1234567890";

const shapeLabels = {
  rectangular: "Rectangular",
  square: "Cuadrada",
  round: "Circular",
  oval: "Ovalada",
} as const;

type Shape = keyof typeof shapeLabels;

const initialForm = {
  name: "",
  email: "",
  phone: "",
  shape: "rectangular" as Shape,
  width: "",
  height: "",
  colors: "",
  budget: "",
  deadline: "",
  design: "",
};

type CustomOrderForm = typeof initialForm;

const getPreviewShape = (shape: Shape) => {
  if (shape === "round") return { borderRadius: "50%", aspectRatio: "1" };
  if (shape === "oval") return { borderRadius: "50%", aspectRatio: "1.55" };
  if (shape === "square") return { borderRadius: "8px", aspectRatio: "1" };
  return { borderRadius: "8px", aspectRatio: "1.35" };
};

const buildWhatsAppMessage = (
  form: CustomOrderForm,
  imageUrl?: string,
  requestId?: string
) =>
  [
    "Hola Wavy Carpets, quiero pedir una alfombra personalizada.",
    requestId ? `Solicitud: ${requestId}` : "",
    `Nombre: ${form.name}`,
    `Email: ${form.email}`,
    `Telefono: ${form.phone}`,
    `Forma: ${shapeLabels[form.shape]}`,
    `Medidas: ${form.width} x ${form.height} cm`,
    form.colors ? `Colores: ${form.colors}` : "",
    form.budget ? `Presupuesto aproximado: ${form.budget}` : "",
    form.deadline ? `Fecha ideal: ${form.deadline}` : "",
    `Diseno: ${form.design}`,
    imageUrl ? `Imagen de referencia: ${imageUrl}` : "Adjunto la imagen de referencia por WhatsApp.",
  ]
    .filter(Boolean)
    .join("\n");

const buildWhatsAppUrl = (
  form: CustomOrderForm,
  imageUrl?: string,
  requestId?: string
) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    buildWhatsAppMessage(form, imageUrl, requestId)
  )}`;

const CustomOrder = () => {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState(buildWhatsAppUrl(initialForm));

  const previewShape = useMemo(() => getPreviewShape(form.shape), [form.shape]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  useEffect(() => {
    setWhatsappUrl(buildWhatsAppUrl(form));
  }, [form]);

  const updateField = (field: keyof CustomOrderForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Completa tu nombre.";
    if (!form.email.trim()) return "Completa tu email.";
    if (!form.phone.trim()) return "Completa tu telefono.";
    if (!form.width.trim()) return "Indica el ancho.";
    if (!form.height.trim()) return "Indica el alto.";
    if (!form.design.trim()) return "Conta como queres el diseno.";
    if (!file) return "Subi una imagen de referencia.";
    return "";
  };

  const uploadReferenceImage = async () => {
    if (!file) return "";

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const imageRef = ref(storage, `custom-orders/${Date.now()}_${safeName}`);
    const snapshot = await uploadBytes(imageRef, file, {
      contentType: file.type,
    });

    return getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const imageUrl = await uploadReferenceImage();
      const requestRef = await addDoc(collection(db, "customOrders"), {
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        shape: form.shape,
        shapeLabel: shapeLabels[form.shape],
        width: form.width.trim(),
        height: form.height.trim(),
        colors: form.colors.trim(),
        budget: form.budget.trim(),
        deadline: form.deadline,
        design: form.design.trim(),
        imageUrl,
        status: "pending",
        source: "web-custom-order",
        createdAt: serverTimestamp(),
      });

      setSuccess("Solicitud enviada. Te recomendamos mandarla por WhatsApp para coordinar mas rapido.");
      setWhatsappUrl(buildWhatsAppUrl(form, imageUrl, requestRef.id));
      setForm(initialForm);
      setFile(null);
    } catch (submitError) {
      console.error(submitError);
      setError(
        `${getFirebaseErrorMessage(submitError)} Podes mandarla por WhatsApp y adjuntar la imagen manualmente.`
      );
      setWhatsappUrl(buildWhatsAppUrl(form));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box component="main" sx={{ minHeight: "100vh", pt: { xs: 14, md: 16 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2} sx={{ position: { md: "sticky" }, top: { md: 120 } }}>
              <Chip label="Pedido custom" color="primary" sx={{ width: "fit-content" }} />
              <Typography
                variant="h2"
                component="h1"
                sx={{ fontFamily: "'Archivo Black', 'Work Sans', sans-serif", lineHeight: 0.95 }}
              >
                Tu imagen hecha alfombra
              </Typography>
              <Typography color="text.secondary">
                Sube una referencia, elegi la forma, medidas y contanos como queres el diseno. Nosotros lo revisamos y te respondemos con presupuesto.
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: retroPalette.paper,
                  border: `3px solid ${retroPalette.border}`,
                  boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    ...previewShape,
                    border: `3px solid ${retroPalette.border}`,
                    overflow: "hidden",
                    bgcolor: retroPalette.cream,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {previewUrl ? (
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="Referencia para alfombra personalizada"
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Typography fontWeight={900} textAlign="center" sx={{ px: 2 }}>
                      Vista previa de tu forma
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Stack>
          </Grid>

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
                <Typography variant="h4">Datos del pedido</Typography>
                {error && <Alert severity="warning">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

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
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Telefono"
                      fullWidth
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button variant="outlined" component="label" sx={{ bgcolor: retroPalette.paper }}>
                      Subir imagen de referencia
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                      />
                    </Button>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {file ? file.name : "JPG, PNG o WEBP. Una imagen clara ayuda a presupuestar mejor."}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth>
                      <InputLabel>Forma</InputLabel>
                      <Select
                        label="Forma"
                        value={form.shape}
                        onChange={(event) => updateField("shape", event.target.value)}
                      >
                        {Object.entries(shapeLabels).map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <TextField
                      label="Ancho cm"
                      fullWidth
                      value={form.width}
                      onChange={(event) => updateField("width", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <TextField
                      label="Alto cm"
                      fullWidth
                      value={form.height}
                      onChange={(event) => updateField("height", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Colores deseados"
                      fullWidth
                      value={form.colors}
                      onChange={(event) => updateField("colors", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Presupuesto aproximado"
                      fullWidth
                      value={form.budget}
                      onChange={(event) => updateField("budget", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Fecha ideal"
                      type="date"
                      fullWidth
                      value={form.deadline}
                      onChange={(event) => updateField("deadline", event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Como queres el diseno?"
                      fullWidth
                      multiline
                      minRows={5}
                      value={form.design}
                      onChange={(event) => updateField("design", event.target.value)}
                    />
                  </Grid>
                </Grid>

                {saving && <LinearProgress />}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? "Enviando..." : "Enviar solicitud"}
                  </Button>
                  <Button
                    variant="outlined"
                    href={whatsappUrl}
                    target="_blank"
                    sx={{ bgcolor: retroPalette.paper }}
                  >
                    Consultar por WhatsApp
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomOrder;
