import { Box, Pagination } from '@mui/material';
import { Avatar, Button, Card, Flex, Heading, Separator, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { PartnerService } from '../../services/PartnerService';
import { Product } from '../../types/Product';
import { ArrowLeft } from '@mui/icons-material';

const AdminProductsContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { ownerId } = useParams<{ ownerId: string }>();
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const partnerService = new PartnerService();

  useEffect(() => {
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
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (ownerId) {
      fetchProducts();
    } else {
      setError('No partner ID provided');
      setLoading(false);
    }
  }, [ownerId, currentPage]);

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'number' ? price : Number(price);
    return isNaN(numPrice) ? '$0.00' : `$${numPrice.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <BounceLoader color="#4CAF50" size={35}/>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Heading size="6" mb="4">Partner Products</Heading>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="6" mb="4">Partner Products ({totalCount} total)</Heading>
      
      <Card>
        <Flex direction="column" gap="3">
          {products.length > 0 ? (
            <>
              {products.map((product, index) => (
                <React.Fragment key={product.id}>
                  <Flex justify="between" align="center" py="2">
                    <Flex gap="3" align="center">
                      <Avatar 
                        size="3" 
                        radius="full"
                        src={
                          typeof product.image === 'string' 
                            ? `http://localhost:5000/${product.image}`
                            : undefined
                        }
                        fallback={product.name.charAt(0).toUpperCase()}
                      />
                      <Box>
                        <Text weight="bold">{product.name}</Text>
                        <Flex gap="2" mt="1">
                          <Text size="2">{formatPrice(product.price)}</Text>
                          <Text size="2" color="gray">•</Text>
                          <Text size="2" color={product.stock > 0 ? 'green' : 'red'}>
                            {product.stock} in stock
                          </Text>
                        </Flex>
                        {product.description && (
                          <Text size="1" color="gray" mt="1">
                            {product.description.length > 50 
                              ? `${product.description.substring(0, 50)}...` 
                              : product.description}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                    <Button 
                      variant="soft" 
                      size="1"
                      onClick={() => navigate(`/AdminDashboard/products/${product.id}`)}
                    >
                      View
                    </Button>
                  </Flex>
                  {index < products.length - 1 && <Separator size="4" />}
                </React.Fragment>
              ))}
              
              <Flex justify="center" mt="4">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_event, page) => setCurrentPage(page)}
                 
                />
              </Flex>
            </>
          ) : (
            <Text align="center">No products found for this partner</Text>
          )}
        </Flex>
      </Card>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
        <Button 
          variant="soft" 
          onClick={() => navigate('/AdminDashboard')}
          
        >
          <ArrowLeft />
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default AdminProductsContent;