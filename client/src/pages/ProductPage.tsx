import { Box } from "@mui/material";
import React from "react";
import Footer from "../components/Footer";
import ProductCarousel from "../components/ProductCarousel/ProductMulti-Carousel";
import ProductGrid from "../components/ProductGrid";
import ProductSlider from "../components/slider/ProductSlider";

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
          
    <div style={{ paddingTop:"250px", width:"101%" }}>
      <Footer />
      </div>
    </Box>
    
  );
};

export default ProductPage;