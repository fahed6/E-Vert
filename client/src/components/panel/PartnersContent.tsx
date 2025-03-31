// components/PartnersContent.tsx
import React from 'react';
import { Avatar, Badge, Box, Button, Card, Flex, Heading, Separator, Text } from '@radix-ui/themes';

const PartnersContent: React.FC = () => (
  <Box>
    <Heading size="6" mb="4">Partners Management</Heading>
    <Card>
      <Flex direction="column" gap="3">
        {[1, 2, 3, 4, 5].map((i) => (
          <React.Fragment key={i}>
            <Flex justify="between" align="center" py="2">
              <Flex gap="3" align="center">
                <Avatar fallback={`P${i}`} size="3" />
                <Box>
                  <Text weight="bold">Partner Company {i}</Text>
                  <Text size="2" color="gray">contact@partnercompany{i}.com</Text>
                </Box>
              </Flex>
              <Flex gap="2">
                <Badge color={i % 2 === 0 ? "indigo" : "cyan"}>
                  {i % 2 === 0 ? "Supplier" : "Retailer"}
                </Badge>
                <Button variant="soft" size="1">View</Button>
                <Button variant="soft" size="1">Edit</Button>
              </Flex>
            </Flex>
            {i < 5 && <Separator size="4" />}
          </React.Fragment>
        ))}
      </Flex>
    </Card>
  </Box>
);

export default PartnersContent;