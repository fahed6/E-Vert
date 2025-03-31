// components/ProductsContent.tsx
import React from 'react';
import { Badge, Box, Button, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';

const ProductsContent: React.FC = () => (
  <Box>
    <Heading size="6" mb="4">Products Management</Heading>
    <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <Flex direction="column" gap="2">
            <Box height="120px" style={{backgroundColor:"gray", borderRadius:"md"}} ></Box>
            <Text weight="bold">Product {i}</Text>
            <Flex justify="between" align="center">
              <Text>${(Math.random() * 100 + 50).toFixed(2)}</Text>
              <Badge color={i % 3 === 0 ? "green" : i % 3 === 1 ? "red" : "gray"}>
                {i % 3 === 0 ? "In Stock" : i % 3 === 1 ? "Out of Stock" : "Low Stock"}
              </Badge>
            </Flex>
            <Flex gap="2" mt="2">
              <Button variant="soft" size="1">Edit</Button>
              <Button variant="soft" size="1" color="red">Delete</Button>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Grid>
  </Box>
);

export default ProductsContent;