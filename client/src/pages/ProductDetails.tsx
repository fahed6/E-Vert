import { ChevronLeft } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { ProductService } from "../services/ProductService";
import { Product } from "../types/Product";
import ProductMultiCarousel from "../components/ProductCarousel/ProductMulti-Carousel";
import { CartService } from "../services/CartService";
import useUserData from "../hooks/useUserData";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the product ID from the URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const navigate = useNavigate();
  const productService = new ProductService();
  const cartService = new CartService();
  const user = useUserData();

  // Fetch product details when the component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productService.getProductById(Number(id));
        setProduct(productData);
      } catch (error) {
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle adding a product to the cart
  const handleAddToCart = async () => {
    if (!user?.id) {
      setCartError("Please log in to add items to your cart.");
      return;
    }

    if (!product) {
      setCartError("Product not found.");
      return;
    }

    try {
      await cartService.addToCart(user.id, product.id, 1); // Add 1 item by default
      setCartError(null);
      alert("Product added to cart!");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      setCartError("Failed to add product to cart. Please try again.");
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  if (!product) {
    return <Text>Product not found.</Text>;
  }

  return (
    <Box>
      {/* Back button */}
      <IconButton onClick={() => navigate(-1)}><ChevronLeft /></IconButton>

      {/* Product details layout */}
      <Flex mt="4" gap="6">
        {/* Left side: Product image */}
        <Box style={{ flex: 1 }}>
          {product.image && (
            <img
              src={`http://localhost:5000/${product.image}`}
              alt={product.name}
              style={{ width: "100%", maxWidth: "500px", borderRadius: "8px" }}
            />
          )}
        </Box>

        {/* Right side: Product details */}
        <Box style={{ flex: 1 }}>
          <Flex direction="column" gap="3">
            {/* Product name */}
            <Text size="7" weight="bold">
              {product.name}
            </Text>

            {/* Product description */}
            <Text size="3" color="gray">
              {product.description}
            </Text>

            {/* Product price */}
            <Text size="4" weight="bold">
              ${Number(product.price).toFixed(2)}
            </Text>

            {/* Product stock */}
            <Text size="2" color="gray">
              Stock: {product.stock}
            </Text>

            {/* Add to cart button */}
            <Button
              variant="solid"
              size="3"
              style={{ width: "150px" }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>

            {/* Display cart error */}
            {cartError && (
              <Text size="2" color="red">
                {cartError}
              </Text>
            )}
          </Flex>
        </Box>
      </Flex>

      {/* Related products carousel */}
      <Box>
        <Text>See related products</Text>
        <ProductMultiCarousel />
      </Box>

      {/* Footer */}
      <div style={{ paddingTop: "250px", width: "101%" }}>
        <Footer />
      </div>
    </Box>
  );
};

export default ProductDetails;