import { Pagination, Box as Boxi } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Badge, Box, Button, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import { BounceLoader } from 'react-spinners';
import { Product } from '../../../types/Product';
import { PartnerService } from '../../../services/PartnerService';
import useUserData from '../../../hooks/useUserData';
import AddProductDialog from './partnerComponents/AddProductDialog';

const ProductsContent: React.FC = () => {
  const user = useUserData();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const ownerId = user?.id;
  const itemsPerPage = 6;
  const partnerService = new PartnerService();

  useEffect(() => {
    // Only run when we have a valid ownerId
    if (!ownerId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await partnerService.getProductsByOwnerId(Number(ownerId), {
          page: currentPage,
          limit: itemsPerPage
        });

        setProducts(response.data);
        setTotalCount(response.pagination.totalCount);
        setTotalPages(response.pagination.totalPages);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [ownerId, currentPage]);

  const getStockStatus = (stock: number) => {
    if (stock > 10) return { label: 'In Stock', color: 'green' };
    if (stock > 0) return { label: 'Low Stock', color: 'amber' };
    return { label: 'Out of Stock', color: 'red' };
  };

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  // Show loading spinner while waiting for user data
  if (loading) {
    return (
      <Boxi sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <BounceLoader color="#4CAF50" size={35}/>
      </Boxi>
    );
  }
  if (!ownerId && !error) {
    return (
      <Box style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '200px'
      }}>
        <BounceLoader color="#4CAF50" size={35}/>
      </Box>
    );
  }

  // Show error if we have one
  if (error) {
    return (
      <Box>
        <Heading size="6" mb="4">Products Management</Heading>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">Products Management ({totalCount} total)</Heading>
        <AddProductDialog />
      </Flex>
      
      <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="4" mb="4">
        {products.length > 0 ? (
          products.map((product) => (
            <Card key={product.id}>
              <Flex direction="column" gap="2">
              <Box 
  height="120px" 
  position="relative"
  overflow="hidden"
  style={{ borderRadius: "var(--radius-2)" }}
>
  {product.image ? (
    <img
      src={`http://localhost:5000/${product.image}`}
      alt={product.name}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center'
      }}
    />
  ) : (
    <Box 
      width="100%" 
      height="100%" 
      style={{ backgroundColor: "gray" }}
    />
  )}
</Box>
                <Text weight="bold">{product.name}</Text>
                <Flex justify="between" align="center">
                  <Text>{formatPrice(product.price)}</Text>
                  <Badge>
                    {getStockStatus(product.stock).label}
                  </Badge>
                </Flex>
                <Flex gap="2" mt="2">
                  <Button variant="soft" size="1">Edit</Button>
                  <Button variant="soft" size="1" color="red">Delete</Button>
                </Flex>
              </Flex>
            </Card>
          ))
        ) : (
          <Text align="center">No products found</Text>
        )}
      </Grid>

      {totalPages > 1 && (
        <Flex justify="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_event, page) => setCurrentPage(page)}
          />
        </Flex>
      )}
    </Box>
  );
};

export default ProductsContent;