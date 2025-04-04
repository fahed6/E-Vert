import { Badge, Card, Flex, Heading, Text } from '@radix-ui/themes';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  color: string; // Should be a Radix color name like "green", "blue", etc.
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, color }) => (
  <Card 
    variant="ghost"
    style={{ 
      position: 'relative',
      padding: 'var(--space-3)',
      margin: 'var(--space-1)',

      overflow: 'hidden',
      // Gradient from light to normal color
      background: `linear-gradient(99deg, var(--${color}-9) 0%, var(--${color}-5) 100%)`
    }}
  >
    <Flex direction="column" gap="2" style={{ position: 'relative', zIndex: 1 }}>
      <Text size="4" style={{ color: "white" }} weight="medium">
        {title}
      </Text>
      <Flex justify="between" align="center">
        <Heading size="5" style={{ color: "white" }}>
          {value}
        </Heading>
        <Badge 
          color={trend.startsWith('+') ? "green" : "red"} 
         
          
        >
          {trend}
        </Badge>
      </Flex>
    </Flex>
  </Card>
);

export default StatCard;