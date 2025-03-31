// components/CustomersContent.tsx
import React from 'react';
import { Avatar, Badge, Box, Button, Card, Flex, Heading, Separator, Text } from '@radix-ui/themes';

const CustomersContent: React.FC = () => (
  <Box>
    <Heading size="6" mb="4">Customers Management</Heading>
    <Card>
      <Flex direction="column" gap="3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <React.Fragment key={i}>
            <Flex justify="between" align="center" py="2">
              <Flex gap="3" align="center">
                <Avatar fallback={`C${i}`} />
                <Box>
                  <Text weight="bold">Customer Name {i}</Text>
                  <Text size="2" color="gray">customer{i}@example.com</Text>
                </Box>
              </Flex>
              <Flex gap="2">
                <Badge color={i % 3 === 0 ? "green" : i % 3 === 1 ? "blue" : "amber"}>
                  {i % 3 === 0 ? "Regular" : i % 3 === 1 ? "New" : "VIP"}
                </Badge>
                <Button variant="soft" size="1">View</Button>
                <Button variant="soft" size="1">Edit</Button>
              </Flex>
            </Flex>
            {i < 8 && <Separator size="4" />}
          </React.Fragment>
        ))}
      </Flex>
    </Card>
  </Box>
);

export default CustomersContent;