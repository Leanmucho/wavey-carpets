import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebaseConfig";
import { useAuth } from "../context/useAuth";
import { retroPalette } from "../style/theme";
import { getFirebaseErrorMessage } from "../utils/firebaseError";

const initialForm = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  rating: "5",
  width: "",
  height: "",
  shape: "rectangular",
  materials: "",
  isNew: true,
};

const AdminProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files]
  );

  const updateField = (field: keyof typeof initialForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const uploadImages = async () => {
    const uploads = files.map(async (file) => {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const imageRef = ref(storage, `products/${Date.now()}_${safeName}`);
      const snapshot = await uploadBytes(imageRef, file, {
        contentType: file.type,
      });

      return getDownloadURL(snapshot.ref);
    });

    return Promise.all(uploads);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!user) {
      setError("Tenes que iniciar sesion para cargar productos.");
      return;
    }

    if (files.length === 0) {
      setError("Agrega al menos una imagen del producto.");
      return;
    }

    const price = Number(form.price);
    const oldPrice = form.oldPrice ? Number(form.oldPrice) : undefined;
    const rating = Number(form.rating);

    if (!form.name.trim() || !form.description.trim() || !Number.isFinite(price)) {
      setError("Completa nombre, descripcion y precio.");
      return;
    }

    setSaving(true);

    try {
      const imageUrls = await uploadImages();
      const materials = form.materials
        .split(",")
        .map((material) => material.trim())
        .filter(Boolean);

      await addDoc(collection(db, "products"), {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        ...(oldPrice !== undefined ? { oldPrice } : {}),
        rating: Number.isFinite(rating) ? rating : 5,
        width: form.width.trim(),
        height: form.height.trim(),
        shape: form.shape.trim() || "rectangular",
        materials,
        isNew: form.isNew,
        images: imageUrls,
        image: imageUrls[0],
        createdAt: serverTimestamp(),
      });

      setForm(initialForm);
      setFiles([]);
      setMessage("Producto cargado correctamente.");
    } catch (submitError) {
      console.error(submitError);
      setError(getFirebaseErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <Box component="main" sx={{ minHeight: "75vh", pt: { xs: 14, md: 16 }, px: 2 }}>
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: `3px solid ${retroPalette.border}`,
              boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
              bgcolor: retroPalette.paper,
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              Admin
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Inicia sesion para cargar productos en Firebase.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/login")}>
              Ir a login
            </Button>
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
            Admin productos
          </Typography>
          <Typography color="text.secondary">
            Carga productos en Firestore y sube imagenes a Firebase Storage.
          </Typography>
        </Stack>

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
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Nombre"
                fullWidth
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Precio"
                type="number"
                fullWidth
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Precio anterior"
                type="number"
                fullWidth
                value={form.oldPrice}
                onChange={(event) => updateField("oldPrice", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Descripcion"
                fullWidth
                multiline
                minRows={3}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Rating"
                type="number"
                fullWidth
                value={form.rating}
                onChange={(event) => updateField("rating", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Ancho"
                fullWidth
                value={form.width}
                onChange={(event) => updateField("width", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Alto"
                fullWidth
                value={form.height}
                onChange={(event) => updateField("height", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Forma"
                fullWidth
                value={form.shape}
                onChange={(event) => updateField("shape", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                label="Materiales separados por coma"
                fullWidth
                value={form.materials}
                onChange={(event) => updateField("materials", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.isNew}
                    onChange={(event) => updateField("isNew", event.target.checked)}
                  />
                }
                label="Marcar como nuevo"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button variant="outlined" component="label" sx={{ bgcolor: retroPalette.paper }}>
                Seleccionar imagenes
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
                />
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Se guarda `images` con todas las URLs y `image` con la primera para compatibilidad.
              </Typography>
            </Grid>

            {previews.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Grid container spacing={2}>
                  {previews.map((preview) => (
                    <Grid key={preview.url} size={{ xs: 6, sm: 4, md: 3 }}>
                      <Box
                        component="img"
                        src={preview.url}
                        alt={preview.file.name}
                        sx={{
                          width: "100%",
                          aspectRatio: "1",
                          objectFit: "cover",
                          border: `2px solid ${retroPalette.border}`,
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              {saving && <LinearProgress sx={{ mb: 2 }} />}
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Cargando..." : "Guardar producto"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminProducts;
