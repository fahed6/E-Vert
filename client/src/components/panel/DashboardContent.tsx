// components/DashboardContent.tsx
import React from 'react';
import { Badge, Box, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import StatCard from './StatCard';

const DashboardContent: React.FC = () => (
  <Box>
    <Heading size="6" mb="4">Dashboard Overview</Heading>
    <Grid columns={{ initial: "1", md: "2", lg: "4" }} gap="4">
      <StatCard title="Total Customers" value="2,543" trend="+12%" color="blue" />
      <StatCard title="Total Partners" value="125" trend="+5%" color="green" />
      <StatCard title="Products" value="1,854" trend="+8%" color="violet" />
      <StatCard title="Total Orders" value="6,247" trend="+15%" color="amber" />
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

export default DashboardContent;