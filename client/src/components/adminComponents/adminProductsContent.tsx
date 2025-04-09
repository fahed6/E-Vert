// components/AdminProductsContent.tsx
import React, { useEffect, useState } from 'react';
import { Box as Boxi } from '@mui/material';
import { Avatar, Box, Button, Card, Flex, Heading, Separator, Text } from '@radix-ui/themes';
import { PartnerService } from '../../services/PartnerService';
import { useNavigate, useParams } from 'react-router-dom';
import { Product } from '../../types/Product';
import { BounceLoader } from 'react-spinners';
import { ArrowLeft } from '@mui/icons-material';

const AdminProductsContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ownerId } = useParams<{ ownerId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const partnerService = new PartnerService();
        const response = await partnerService.getProductsByOwnerId(Number(ownerId));
        
        // Handle different response formats
        const productsData = Array.isArray(response) 
          ? response 
          : response?.data && Array.isArray(response.data) 
            ? response.data 
            : [];

        // Ensure price is a number
        const validatedProducts = productsData.map((product: { price: any; }) => ({
          ...product,
          price: typeof product.price === 'number' ? product.price : Number(product.price) || 0
        }));

        setProducts(validatedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
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
  }, [ownerId]);

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'number' ? price : Number(price);
    return isNaN(numPrice) ? '$0.00' : `$${numPrice.toFixed(2)}`;
  };

  if (loading) return (
    <Boxi sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <BounceLoader color="#4CAF50" size={35}/>
    </Boxi>
  );

  if (error) {
    return (
      <Box style={{ padding: '2rem' }}>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  return (
    <Boxi sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '20px',
          backgroundColor: '#f5f5f5'
        }}>
    
    <Boxi maxWidth="750px" width="100%" style={{padding: '20px'}}>
         <Card variant="classic" style={{ 
                  boxShadow: '0 9px 20px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'box-shadow 0.3s ease-in-out', 
                  position: 'relative'
                }}>
    <Button 
                variant="soft" 
                onClick={() => navigate('/AdminDashboard')}
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
            <ArrowLeft />
            Back to Dashboard
          </Button>
           <Flex justify="center" align="center" direction="column" gap="4" style={{marginTop: '40px'}}>
      <Heading size="6" mb="4">Partner Products</Heading>
      </Flex>
      
      <Card>
        <Flex direction="column" gap="3">
          {products.length > 0 ? (
            products.map((product, index) => (
              <React.Fragment key={product.id}>
                <Flex align="center" py="2">
                  <Flex gap="3" align="center" style={{ flex: 1 }}>
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
                    <Box style={{ flex: 1 }}>
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
                </Flex>
                {index < products.length - 1 && <Separator size="4" />}
              </React.Fragment>
            ))
          ) : (
            <Text align="center">No products found for this partner</Text>
          )}
        </Flex>
      </Card>
      </Card>
    </Boxi>
    </Boxi>
  );
};

export default AdminProductsContent;