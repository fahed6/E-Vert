// components/AdminUserEdit.tsx
import { ArrowLeft } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Badge, Box as Boxi, Button, Card, DataList, Dialog, Flex, Grid, TextField as RadixTextField, Text } from '@radix-ui/themes';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BounceLoader } from "react-spinners";
import Swal from "sweetalert2";
import { auth } from '../../config/firebase-config';
import { UserService } from '../../services/UserService';

interface User {
  id: number;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  role: string;
  createdAt: string;
}

const AdminUserEdit: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [isActive, setIsActive] = useState(true);
  const userService = new UserService();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) return;
        
        const response = await userService.getUserById(parseInt(userId));
        if (response) {
          setUser(response);
          setNewFirstName(response.firstName);
          setNewLastName(response.lastName);
          setNewEmail(response.email);
          setNewPhoneNumber(response.phoneNumber);
          setIsActive(response.isActive);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        Swal.fire({
          title: "Failed to load user data",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => navigate('/admin/dashboard'));
      }
    };

    fetchUser();
  }, [userId]);

  const handleSave = async () => {
    if (!user) return;
  
    try {
      const updatedUser = {
        ...user,
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        phoneNumber: newPhoneNumber,
        isActive: isActive
      };
  
      await userService.updateUser(user.id, updatedUser);
  
      setIsDialogOpen(false);
      
      Swal.fire({
        title: "User updated successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        setUser(updatedUser);
      });
  
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        title: "Failed to update user",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, user?.email || '');
      Swal.fire({
        title: "Password reset email sent!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,  
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      Swal.fire({
        title: "Failed to send password reset email",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,  
      });
    }
  };

  const toggleUserStatus = async () => {
    try {
      if (!user) return;
      
      if (user.isActive) {
        await userService.deactivateUser(user.id);
      } else {
        await userService.activateUser(user.id);
      }
      
      setIsActive(!isActive);
      setUser({ ...user, isActive: !user.isActive });
      
      Swal.fire({
        title: `User ${!user.isActive ? 'activated' : 'deactivated'}!`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error toggling user status:", error);
      Swal.fire({
        title: "Failed to update user status",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleRoleChange = async (newRole: string) => {
    try {
      if (!user) return;
      
      let roleUpdateFunction;
      switch (newRole) {
        case 'user':
          roleUpdateFunction = userService.setUserRole;
          break;
        case 'partner':
          roleUpdateFunction = userService.setPartnerRole;
          break;
        case 'admin':
          roleUpdateFunction = userService.setAdminRole;
          break;
        default:
          throw new Error('Invalid role');
      }

      await roleUpdateFunction(user.uid);
      
      // Update local state
      setUser({ ...user, role: newRole });
      
      Swal.fire({
        title: `User role updated to ${newRole}!`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error changing user role:", error);
      Swal.fire({
        title: "Failed to update user role",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  if (!user) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <BounceLoader color="#4CAF50" size={35}/>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <Boxi maxWidth="750px" width="100%" style={{padding: '20px'}}>
        <Card variant="classic" style={{ 
          boxShadow: '0 9px 20px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'box-shadow 0.3s ease-in-out', 
          position: 'relative'
        }}>
          {/* Back Button */}
          <Button 
            variant="soft" 
            onClick={() => navigate('/AdminDashboard')}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <ArrowLeft />
            Back to Dashboard
          </Button>

          <Flex justify="center" align="center" direction="column" gap="4" style={{marginTop: '40px'}}>
            <Text size='6'>User Management</Text>
            <Flex gap="2">
              <Button color='grass' onClick={() => setIsDialogOpen(true)}>
                Edit Information
              </Button>
              <Button 
                color={user.isActive ? 'red' : 'green'} 
                onClick={toggleUserStatus}
              >
                {user.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </Flex>
          </Flex>

          <Grid columns="2" gap="3" width="auto" p="10px" pl="20px">
            <DataList.Root>
              <DataList.Item>
                <DataList.Label>First Name</DataList.Label>
                <DataList.Value>{user.firstName}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Last Name</DataList.Label>
                <DataList.Value>{user.lastName}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Email</DataList.Label>
                <DataList.Value>{user.email }</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Phone Number</DataList.Label>
                <DataList.Value>{user.phoneNumber}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Status</DataList.Label>
                <DataList.Value>
                  <Badge color={user.isActive ? 'green' : 'red'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
  <DataList.Label>Role</DataList.Label>
  <DataList.Value>
    <Flex align="center" gap="2">
      <Badge color={user.role === 'admin' ? 'purple' : 'blue'}>
        {user.role}
      </Badge>
      <Flex gap="1">
        {user.role === 'user' && (
          <>
            <Button 
              size="1" 
              color='blue' 
              variant="soft"
              onClick={() => handleRoleChange('partner')}
            >
              Set Partner
            </Button>
            <Button 
              size="1" 
              color='purple' 
              variant="soft"
              onClick={() => handleRoleChange('admin')}
            >
              Set Admin
            </Button>
          </>
        )}
        {user.role === 'partner' && (
          <>
            <Button 
              size="1" 
              color='blue' 
              variant="soft"
              onClick={() => handleRoleChange('user')}
            >
            Set User
            </Button>
            <Button 
              size="1" 
              color='purple' 
              variant="soft"
              onClick={() => handleRoleChange('admin')}
            >
             Set Admin
            </Button>
          </>
        )}
        {user.role === 'admin' && (
          <>
            <Button 
              size="1" 
              color='blue' 
              variant="soft"
              onClick={() => handleRoleChange('user')}
            >
             Set User
            </Button>
            <Button 
              size="1" 
              color='blue' 
              variant="soft"
              onClick={() => handleRoleChange('partner')}
            >
             Set Partner
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  </DataList.Value>
</DataList.Item>
              <DataList.Item>
                <DataList.Label>Joined Date</DataList.Label>
                <DataList.Value>
                  {new Date(user.createdAt).toLocaleDateString()}
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Grid>

          
          <Flex justify="center" style={{ marginTop: '20px' }}>
            <Button color='grass' onClick={handlePasswordReset}>
              Send Password Reset Email
            </Button>
          </Flex>

          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Content>
              <Dialog.Title>Edit User Information</Dialog.Title>
              <Flex direction="column" gap="3">
                <RadixTextField.Root
                  placeholder="First Name"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                />
                <RadixTextField.Root
                  placeholder="Last Name"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                />
                <RadixTextField.Root
                  placeholder="Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <RadixTextField.Root
                  placeholder="Phone Number"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                />
                <Flex gap="3" justify="end">
                  <Button color='gray' onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Card>
      </Boxi>
    </Box>
  );
};

export default AdminUserEdit;