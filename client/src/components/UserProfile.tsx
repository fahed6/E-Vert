import { Edit } from "@mui/icons-material";
import { Box } from '@mui/material';
import { Box as Boxi, Button, Card, DataList, Dialog, Flex, Grid, TextField as RadixTextField, Text } from '@radix-ui/themes';
import { sendPasswordResetEmail, updateEmail, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import { auth } from '../config/firebase-config';
import useUserData from '../hooks/useUserData';
import { UserService } from '../services/UserService';
import { BounceLoader } from "react-spinners";

const UserProfile: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const user = useUserData();
  const userService = new UserService();

  // Initialize form fields with user data when the dialog opens
  useEffect(() => {
    if (isDialogOpen && user) {
      setNewFirstName(user.firstName);
      setNewLastName(user.lastName);
      setNewEmail(user.email);
      setNewPhoneNumber(user.phoneNumber);
    }
  }, [isDialogOpen, user]);

  const handleSave = async () => {
    if (!user) return;
  
    try {
      const updatedUser = {
        ...user,
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        phoneNumber: newPhoneNumber,
      };
  
      // Update in PostgreSQL
      await userService.updateUser(user.id, updatedUser);
  
      // Update in Firebase (if applicable)
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: `${newFirstName} ${newLastName}`,
        });
        if (newEmail !== user.email) {
          await updateEmail(currentUser, newEmail);
        }
      }
  
      setIsDialogOpen(false);
      
      Swal.fire({
        title: "Profile updated successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,  // 1.5 seconds
      }).then(() => {
        window.location.reload(); // Reload after alert closes
      });
  
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        title: "Failed to update profile",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handlePasswordChange = async () => {
    const currentUser = auth.currentUser;
    if (currentUser?.email) {
      try {
        await sendPasswordResetEmail(auth, currentUser.email);
        Swal.fire({
          title: "Password reset email sent!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,  
        });
        
      } catch (error) {
        console.error("Error sending password reset email:", error);
        Swal.fire({
          title: "Failed to send password reset email!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,  
        });

      }
    } else {
      Swal.fire({
        title: "No user email found!",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,  
      });
    }
  };

  if (!user) {
    return (
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
      }}
    >
    <BounceLoader color="#4CAF50" size={35}/>
    </Box>
  );
  }

  return (
    <Boxi maxWidth="750px">
    <Card >
      <Flex justify="between" align="center">
       <Text size='6'> Personal Information</Text>
        <Button color='grass' onClick={() => setIsDialogOpen(true)}>
          <Edit sx={{ fontSize: '15px' }} />Edit</Button>
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
            <DataList.Value>{user.email}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Phone Number</DataList.Label>
            <DataList.Value>{user.phoneNumber}</DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Grid>

      <Box sx={{ marginTop: 2 }}>
        <Button color='grass' onClick={handlePasswordChange}>Change Password</Button>
      </Box>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content>
          <Dialog.Title>Edit Profile</Dialog.Title>
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
              <Button onClick={handleSave}>Save</Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Card>
    </Boxi>
  );
};

export default UserProfile;