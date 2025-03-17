import React from "react";
import { Box } from "@mui/material";
import ProductCarousel from "../components/ProductCarousel/ProductMulti-Carousel";
import ProductSlider from "../components/slider/ProductSlider";
import ProductGrid from "../components/ProductGrid";

const ProductPage: React.FC = () => {
  return (
    <Box sx={{}}>
      {/* ProductSlider at the top */}
      <Box sx={{}}>
        <ProductSlider />
      </Box>

      {/* ProductCarousel below the ProductSlider */}
      <Box sx={{}}>
        <ProductCarousel />
      </Box>

      {/* ProductGrid below the ProductCarousel */}
      <Box sx={{}}>
        <ProductGrid />
      </Box>
    </Box>
  );
};

export default ProductPage;