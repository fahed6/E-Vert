// components/DashboardContent.tsx
import React, { useEffect, useState } from 'react';
import {Box as Boxi} from '@mui/material'
import { Badge, Box, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import StatCard from '../StatCard';
import { OrderService } from '../../../services/OrderService';
import { PartnerService } from '../../../services/PartnerService';
import useUserData from '../../../hooks/useUserData';
import { BounceLoader } from 'react-spinners';

const PartnerDashboardContent: React.FC = () => {
  const [productCount, setProductCount] = useState<string>('0');
  const [orderCount, setOrderCount] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const partner = useUserData();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        if (partner) {
          const orderService = new OrderService();
          const partnerService = new PartnerService();
          
          // Fetch both counts in parallel
          const [productsResponse, ordersResponse] = await Promise.all([
            partnerService.getProductsCount(partner.id),
            orderService.count()
          ]);

          // Debugging: Log the responses
          console.log('Products Response:', productsResponse);
          console.log('Orders Response:', ordersResponse);

          // Extract counts from responses
          const productsCount = productsResponse?.data?.count || 
                               productsResponse?.count || 
                               0;
          
          const ordersCount = ordersResponse?.data?.count || 
                             ordersResponse?.count || 
                             0;

          // Format numbers with commas
          setProductCount(productsCount.toLocaleString());
          setOrderCount(ordersCount.toLocaleString());
        }
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error('Error fetching counts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [partner]);

  if (loading) {
    return (
      <Boxi sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
      }}>
        <BounceLoader color="#4CAF50" size={35}/>
      </Boxi>
    );
  }

  if (error) {
    return (
      <Box>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="6" mb="4">Dashboard Overview</Heading>
      <Grid columns={{ initial: "1", md: "2", lg: "4" }} gap="4">
        <StatCard 
          title="Total Products" 
          value={productCount}
          trend="+8%" 
          color="indigo" 
        />
        <StatCard 
          title="Total Orders" 
          value={orderCount} 
          trend="+15%" 
          color="amber" 
        />
      </Grid>
      <Grid columns={{ initial: "1", lg: "2" }} gap="4" mt="6">
        <Card>
          <Heading size="4" mb="4">Recent Orders</Heading>
          <Flex direction="column" gap="2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Flex key={i} justify="between" align="center" py="2">
                <Flex gap="2" align="center">
                  <Box width="10px" height="10px" style={{ borderRadius:"full" }}></Box>
                  <Text>Order #{1000 + i}</Text>
                </Flex>
                <Badge color={i % 2 === 0 ? "green" : "blue"}>
                  {i % 2 === 0 ? "Completed" : "Processing"}
                </Badge>
                <Text size="2" color="gray">${(Math.random() * 100 + 50).toFixed(2)}</Text>
              </Flex>
            ))}
          </Flex>
        </Card>
        
        <Card>
          <Heading size="4" mb="4">Top Products</Heading>
          <Flex direction="column" gap="3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Flex key={i} justify="between" align="center">
                <Flex gap="2" align="center">
                  <Box width="40px" height="40px" style={{backgroundColor:"gray", borderRadius:"md"}} ></Box>
                  <Text>Product {i}</Text>
                </Flex>
                <Badge>{(Math.random() * 100 + 100).toFixed(0)} sold</Badge>
              </Flex>
            ))}
          </Flex>
        </Card>
      </Grid>
    </Box>
  );
};

export default PartnerDashboardContent;