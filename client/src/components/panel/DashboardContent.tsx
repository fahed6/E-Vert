// components/DashboardContent.tsx
import { Badge, Box, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { OrderService } from '../../services/OrderService';
import { ProductService } from '../../services/ProductService';
import { UserService } from '../../services/UserService';
import StatCard from './StatCard';

const DashboardContent: React.FC = () => {
  const [customerCount, setCustomerCount] = useState<string>('0');
  const [partnerCount, setPartnerCount] = useState<string>('0');
  const [ProductCount, setProductCount] = useState<string>('0');
  const [revenue, setRevenue] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productDistribution, setProductDistribution] = useState<any[]>([]);

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
          revenueResponse,
          salesResponse,
          distributionResponse
        ] = await Promise.all([
          userService.countUsers(),
          userService.countPartners(),
          productService.count(),
          orderService.getMonthRevenue(),
          orderService.getSalesTrend(),
          productService.getDistribution()
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

          // Set chart data
          if (salesResponse) {
            setSalesData(salesResponse.data || salesResponse);
          }
          if (distributionResponse) {
            setProductDistribution(distributionResponse.data || distributionResponse);
          }
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

  // Default chart data in case API doesn't return data
  const defaultSalesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
  ];

  const defaultProductDistribution = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Home Goods', value: 200 },
    { name: 'Books', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
          <Heading size="4" mb="4">Sales Trend</Heading>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={salesData.length ? salesData : defaultSalesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Monthly Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card>
          <Heading size="4" mb="4">Product Distribution</Heading>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={productDistribution.length ? productDistribution : defaultProductDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {defaultProductDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
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

export default DashboardContent;