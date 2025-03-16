import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Theme } from "@radix-ui/themes";
import ProductCard from "../ProductCard";
import { Product } from "../../types/Product";
import { ProductService } from "../../services/ProductService";
import "./ProductMulti-Carousel.css";

const productService = new ProductService();

// Define responsive breakpoints for the carousel
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const ProductMultiCarousel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getRandomProducts(); // Fetch products
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Theme>
      <Carousel
        responsive={responsive}
        containerClass="carousel-container" // Custom class for the container
        itemClass="carousel-item" // Custom class for each item
        removeArrowOnDeviceType={["tablet", "mobile"]} // Optional: Remove arrows on specific devices
        infinite={true} // Enable infinite scrolling
        
      >
        {products.map((product) => (
          <div key={product.id} style={{ padding: "0 5px", paddingTop:"50px" }}> {/* Adjust padding if needed */}
            <ProductCard product={product} />
          </div>
        ))}
      </Carousel>
    </Theme>
  );
};

export default ProductMultiCarousel;