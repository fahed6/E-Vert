import { Badge, Card, Flex, Heading, Text } from '@radix-ui/themes';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, color }) => (
  <Card>
    <Flex direction="column" gap="1">
      <Text size="2" color="gray">{title}</Text>
      <Flex justify="between" align="center">
        <Heading size="5">{value}</Heading>
        <Badge color={trend.startsWith('+') ? "green" : "red"}>{trend}</Badge>
      </Flex>
    </Flex>
  </Card>
);

export default StatCard;











