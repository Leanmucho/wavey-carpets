interface FirebaseLikeError {
  code?: string;
  message?: string;
}

const errorHelp: Record<string, string> = {
  "storage/unauthorized": "Storage rechazo la subida. Revisa storage.rules.",
  "permission-denied": "Firestore rechazo la escritura. Revisa firestore.rules.",
  unauthenticated: "La sesion no esta activa. Vuelve a iniciar sesion.",
};

export const getFirebaseErrorMessage = (error: unknown) => {
  const firebaseError = error as FirebaseLikeError;
  const code = firebaseError.code ?? "unknown";
  const message = firebaseError.message ?? "Sin detalle";
  const help = errorHelp[code] ?? "Revisa permisos, reglas y conexion de Firebase.";

  return `${help} Codigo: ${code}. Detalle: ${message}`;
};
