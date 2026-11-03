import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types";
import { loadCatalog } from "../utils/catalog";

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt(value => value + 1), []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    loadCatalog().then(items => {
      if (active) setProducts(items);
    }).catch(() => {
      if (active) { setProducts([]); setError(true); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  return { products, loading, error, retry };
}
