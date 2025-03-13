import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel/ProductMulti-Carousel";
import ProductSlider from "../components/slider/ProductSlider";

const ProductPage: React.FC = () => {
  return (
    <Box sx={{}}>
      {/* ProductSlider at the top */}
      <Box sx={{}}>
        <ProductSlider />
      </Box>

      {/* ProductCarousel below the ProductSlider */}
      <Box sx={{ }}>
        <ProductCarousel />
      </Box>

      {/* Outlet for nested routes */}
      <Box
        component="main"
        sx={{ }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default ProductPage;