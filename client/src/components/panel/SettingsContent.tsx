// components/SettingsContent.tsx
import React from 'react';
import { Box, Button, Card, Flex, Heading, Separator, Text } from '@radix-ui/themes';

const SettingsContent: React.FC = () => (
  <Box>
    <Heading size="6" mb="4">Settings</Heading>
    <Card>
      <Flex direction="column" gap="4">
        <Box>
          <Text weight="bold" mb="2">General Settings</Text>
          <Flex direction="column" gap="2">
            <Flex justify="between" align="center">
              <Text>Notifications</Text>
              <Button variant="soft" size="1">Configure</Button>
            </Flex>
            <Flex justify="between" align="center">
              <Text>Display Preferences</Text>
              <Button variant="soft" size="1">Configure</Button>
            </Flex>
          </Flex>
        </Box>
        
        <Separator size="4" />
        
        <Box>
          <Text weight="bold" mb="2">Account Settings</Text>
          <Flex direction="column" gap="2">
            <Flex justify="between" align="center">
              <Text>Profile Information</Text>
              <Button variant="soft" size="1">Edit</Button>
            </Flex>
            <Flex justify="between" align="center">
              <Text>Security</Text>
              <Button variant="soft" size="1">Configure</Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Card>
  </Box>
);

export default SettingsContent;