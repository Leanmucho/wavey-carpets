import { useLocation } from "react-router-dom";
import { Typography, Box } from "@mui/material";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get("q");

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Resultados para: "{searchTerm}"</Typography>
      {/* Aquí irían los resultados de productos */}
    </Box>
  );
};

export default SearchResults;