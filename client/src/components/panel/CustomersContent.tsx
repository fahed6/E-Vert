// components/CustomersContent.tsx
import React, { useEffect, useState } from 'react';
import { Badge, Box, Button, Card, Flex, Heading, Separator, Text, Spinner } from '@radix-ui/themes';
import { UserService } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';

interface Customer {
  id: number;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
  role: string;
  address?: {
    street?: string;
    city?: string;
  };
}

const CustomersContent: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const userService = new UserService();
        const response = await userService.getRegularUsers();
        
        if (Array.isArray(response)) {
          setCustomers(response);
        } else if (response?.data && Array.isArray(response.data)) {
          setCustomers(response.data);
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        setError('Failed to fetch customers');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const userService = new UserService();
      
      if (currentStatus) {
        await userService.deactivateUser(id);
      } else {
        await userService.activateUser(id);
      }
      
      setCustomers(customers.map(customer => 
        customer.id === id 
          ? { ...customer, isActive: !currentStatus } 
          : customer
      ));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Spinner size="3" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Heading size="6" mb="4">Customers Management</Heading>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="6" mb="4">Customers Management</Heading>
      
      <Card>
        <Flex direction="column" gap="3">
          {customers.length > 0 ? (
            customers.map((customer, index) => (
              <React.Fragment key={customer.id}>
                <Flex justify="between" align="center" py="2">
                  <Box>
                    <Text weight="bold">
                      {customer.firstName} {customer.lastName} 
                      </Text> <Badge color={customer.isActive ? 'green' : 'red'}>
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                      <br></br>
                    
                    <Text size="2" color="gray"> {customer.email}</Text>

                   
                    <Flex gap="2" mt="1">
                      {customer.phoneNumber && (
                        <Text size="1">{customer.phoneNumber}</Text>
                      )}
                      {customer.address?.city && (
                        <Text size="1" color="gray">• {customer.address.city}</Text>
                      )}
                    </Flex>
                    <Text size="1" color="gray">
                      Joined: {new Date(customer.createdAt).toLocaleDateString()}
                    </Text>
                  </Box>
                  
                  <Flex gap="2" align="center">
                    
                    {customer.isActive ? (
                      <Button 
                        variant="soft" 
                        size="1" 
                        color="red"
                        onClick={() => handleToggleStatus(customer.id, true)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button 
                        variant="soft" 
                        size="1" 
                        color="green"
                        onClick={() => handleToggleStatus(customer.id, false)}
                      >
                        Activate
                      </Button>
                    )}
                    <Button variant="soft" size="1"  onClick={() => navigate(`/AdminDashboard/users/orders/${customer.id}`)}>View Orders</Button>
                    <Button variant="soft" size="1"  onClick={() => navigate(`/AdminDashboard/users/edit/${customer.id}`)}>Edit</Button>
                  </Flex>
                </Flex>
                {index < customers.length - 1 && <Separator size="4" />}
              </React.Fragment>
            ))
          ) : (
            <Text align="center" >No customers found</Text>
          )}
        </Flex>
      </Card>
    </Box>
  );
};

export default CustomersContent;