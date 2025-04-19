// components/DashboardContent.tsx
import React, { useEffect, useState } from 'react';
import { Badge, Box, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import StatCard from './StatCard';
import { UserService } from '../../services/UserService';
import { ProductService } from '../../services/ProductService';
import { OrderService } from '../../services/OrderService';

const DashboardContent: React.FC = () => {
  const [customerCount, setCustomerCount] = useState<string>('0');
  const [partnerCount, setPartnerCount] = useState<string>('0');
  const [ProductCount, setProductCount] = useState<string>('0');
  const [revenue, setRevenue] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userService = new UserService();
        const productService = new ProductService();
        const orderService = new OrderService();
        
        // Fetch all data in parallel
        const [
          customersResponse, 
          partnersResponse,
          ProductResponse,
          revenueResponse
        ] = await Promise.all([
          userService.countUsers(),
          userService.countPartners(),
          productService.count(),
          orderService.getMonthRevenue()
        ]);

        // Check if responses are valid
        if (customersResponse && partnersResponse && ProductResponse && revenueResponse) {
          // Access the count directly from response
          const customers = customersResponse.count || customersResponse.data?.count || 0;
          const partners = partnersResponse.count || partnersResponse.data?.count || 0;
          const products = ProductResponse.count || ProductResponse.data?.count || 0;
          const monthlyRevenue = revenueResponse.revenue || revenueResponse.data?.revenue || 0;
          
          // Format numbers with commas
          setCustomerCount(Number(customers).toLocaleString());
          setPartnerCount(Number(partners).toLocaleString());
          setProductCount(Number(products).toLocaleString());
          setRevenue(Number(monthlyRevenue).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }));
        } else {
          throw new Error('Invalid response from server');
        }
        
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return <Text>Loading dashboard data...</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return (
    <Box>
    <Heading size="6" mb="4">Dashboard Overview</Heading>
    <Grid columns={{ initial: "1", md: "2", lg: "4" }} gap="4">
      <StatCard 
        title="Monthly Revenue" 
        value={revenue} 
        trend="+12%" 
        color="purple" 
      />
      <StatCard 
        title="Total Partners" 
        value={partnerCount} 
        trend="+5%" 
        color="grass" 
      />
       <StatCard 
        title="Total Customers" 
        value={customerCount} 
        trend="+15%" 
        color="indigo" 
      />
      <StatCard 
        title="Total Products" 
        value={ProductCount}
        trend="+8%" 
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
      
      {/* Rest of your component remains the same */}
      {/* ... */}
    </Box>
  );
};

export default DashboardContent;