// components/OrdersContent.tsx
import React from 'react';
import { Badge, Box, Button, Card, Flex, Heading, Separator, Text } from '@radix-ui/themes';

const OrdersContent: React.FC = () => (
  <Box>
    <Heading size="6" mb="4">Orders Management</Heading>
    <Card>
      <Flex direction="column" gap="3">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <React.Fragment key={i}>
            <Flex justify="between" align="center" py="2">
              <Flex gap="3" align="center">
                <Box>
                  <Text weight="bold">Order #{1000 + i}</Text>
                  <Text size="2" color="gray">March {i + 20}, 2025</Text>
                </Box>
              </Flex>
              <Flex gap="3" align="center">
                <Text>${(Math.random() * 200 + 100).toFixed(2)}</Text>
                <Badge color={i % 4 === 0 ? "green" : i % 4 === 1 ? "amber" : i % 4 === 2 ? "blue" : "red"}>
                  {i % 4 === 0 ? "Completed" : i % 4 === 1 ? "Processing" : i % 4 === 2 ? "Shipped" : "Cancelled"}
                </Badge>
                <Button variant="soft" size="1">View</Button>
              </Flex>
            </Flex>
            {i < 7 && <Separator size="4" />}
          </React.Fragment>
        ))}
      </Flex>
    </Card>
  </Box>
);

export default OrdersContent;