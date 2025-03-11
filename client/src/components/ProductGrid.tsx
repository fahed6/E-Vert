import { Box, Card, Flex, Grid, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { ProductService } from "../services/ProductService";
import { Product } from "../types/Product";

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const productService = new ProductService();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        const productsWithNumberPrice = data.map((product) => ({
          ...product,
          price: Number(product.price), // Convert price to a number
        }));
        setProducts(productsWithNumberPrice);
        console.log(data[8].image)
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <Box>
      <Text size="6" weight="bold" mb="4">
        Products
      </Text>
      <Grid columns="3" gap="5" width="auto">
        {products.map((product) => (
          
          <Card key={product.id}>
            <Flex direction="column" gap="3">
              {product.image && (
                <img
                  src={`http://localhost:5000/${product.image}`} // Serve the image
                  alt={product.name}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  loading="lazy"
                />
              )}
              <Text size="4" weight="bold">
                {product.name}
              </Text>
              <Text size="2" color="gray">
                {product.description}
              </Text>
              <Flex justify="between" align="center">
                <Text size="2">Stock: {product.stock}</Text>
                <Text size="2">${Number(product.price).toFixed(2)}</Text>
              </Flex>
            </Flex>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid;