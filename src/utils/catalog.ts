import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { normalizeProduct } from "./productMapper";
import type { Product } from "../types";

// Reuse only actual catalog data within this page session; failed requests can retry.
let catalogRequest: Promise<Product[]> | undefined;
let expiresAt = 0;
export function invalidateCatalog() { catalogRequest = undefined; expiresAt = 0; }
export function loadCatalog(): Promise<Product[]> {
  if (!catalogRequest || Date.now() >= expiresAt) {
    expiresAt = Date.now() + 60_000;
    catalogRequest = getDocs(collection(db, "products"))
      .then(snapshot => snapshot.docs.map(doc => normalizeProduct(doc.id, doc.data())))
      .catch(error => { catalogRequest = undefined; throw error; });
  }
  return catalogRequest;
}
