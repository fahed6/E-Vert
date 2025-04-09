// components/PartnersContent.tsx
import React, { useEffect, useState } from 'react';
import { Badge, Box, Button, Card, Flex, Heading, Separator, Text } from '@radix-ui/themes';
import { UserService } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { Box as Boxi } from '@mui/material';


interface Partner {
  id: number;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
  role: 'partner';
  products?: Array<{ id: number; name: string }>;
}

const PartnersContent: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const userService = new UserService();
        const response = await userService.getPartnerUsers();
        
        if (Array.isArray(response)) {
          setPartners(response);
        } else if (response?.data && Array.isArray(response.data)) {
          setPartners(response.data);
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        setError('Failed to fetch partners');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const userService = new UserService();
      
      if (currentStatus) {
        await userService.deactivateUser(id);
      } else {
        await userService.activateUser(id);
      }
      
      setPartners(partners.map(partner => 
        partner.id === id 
          ? { ...partner, isActive: !currentStatus } 
          : partner
      ));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return (
      <Boxi sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <BounceLoader color="#4CAF50" size={35}/>
      </Boxi>
    );
  }

  if (error) {
    return (
      <Box>
        <Heading size="6" mb="4">Partners Management</Heading>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="6" mb="4">Partners Management</Heading>
      
      <Card>
        <Flex direction="column" gap="3">
          {partners.length > 0 ? (
            partners.map((partner, index) => (
              <React.Fragment key={partner.id}>
                <Flex justify="between" align="center" py="2">
                  <Box>
                    <Text weight="bold">
                      {partner.firstName} {partner.lastName} 
                    </Text> <Badge color={partner.isActive ? 'green' : 'red'}>
                      {partner.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <br></br>
                    
                    <Text size="2" color="gray"> {partner.email}</Text>

                    <Flex gap="2" mt="1">
                      {partner.phoneNumber && (
                        <Text size="1">{partner.phoneNumber}</Text>
                      )}
                      {partner.products && partner.products.length > 0 && (
                        <Text size="1" color="gray">• {partner.products.length} product{partner.products.length !== 1 ? 's' : ''}</Text>
                      )}
                    </Flex>
                    <Text size="1" color="gray">
                      Joined: {new Date(partner.createdAt).toLocaleDateString()}
                    </Text>
                  </Box>
                  
                  <Flex gap="2" align="center">
                    {partner.isActive ? (
                      <Button 
                        variant="soft" 
                        size="1" 
                        color="red"
                        onClick={() => handleToggleStatus(partner.id, true)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button 
                        variant="soft" 
                        size="1" 
                        color="green"
                        onClick={() => handleToggleStatus(partner.id, false)}
                      >
                        Activate
                      </Button>
                    )}
                    <Button 
                      variant="soft" 
                      size="1"  
                      onClick={() => navigate(`/AdminDashboard/partners/products/${partner.id}`)}
                    >
                      View Products
                    </Button>
                    <Button 
                      variant="soft" 
                      size="1"  
                      onClick={() => navigate(`/AdminDashboard/users/edit/${partner.id}`)}
                      
                    >
                      Edit
                    </Button>
                  </Flex>
                </Flex>
                {index < partners.length - 1 && <Separator size="4" />}
              </React.Fragment>
            ))
          ) : (
            <Text align="center">No partners found</Text>
          )}
        </Flex>
      </Card>
    </Box>
  );
};

export default PartnersContent;