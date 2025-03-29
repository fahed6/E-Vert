import { Edit } from "@mui/icons-material";
import { Box as Boxi, Button, Card, DataList, Dialog, Flex, Grid, TextField as RadixTextField, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useUserData from "../hooks/useUserData";
import { AddressService } from "../services/AddressService";
import { BounceLoader} from 'react-spinners';
import { Box } from "@mui/material";

const UserAddress: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCodePost, setNewCodePost] = useState<number | "">("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newStreetAddress, setNewStreetAddress] = useState("");
  const [address, setAddress] = useState<any>(null); // State to store address
  const user = useUserData();
  const addressService = new AddressService();

  // Fetch address when the component loads
  useEffect(() => {
    if (user) {
      const fetchAddress = async () => {
        const addressData = await addressService.getAddressByUserId(user.id);
        setAddress(addressData);
      };
      fetchAddress();
    }
  }, [user]);

  // Initialize address form fields with address data when the dialog opens
  useEffect(() => {
    if (isDialogOpen && address) {
      setNewCodePost(address.CodePost || "");
      setNewCity(address.City || "");
      setNewState(address.State || "");
      setNewStreetAddress(address.StreetAddress || "");
    }
  }, [isDialogOpen, address]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const addressData = {
        CodePost: newCodePost,
        City: newCity,
        State: newState,
        StreetAddress: newStreetAddress,
      };

      // Save or update address
      await addressService.saveAddress(user.id, addressData);

      setIsDialogOpen(false);
      Swal.fire({
        title: "Address updated successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,  
      }).then(() => {
        window.location.reload();
      });

      
    } catch (error) {
      console.error("Error updating address:", error);
      Swal.fire({
        title: "Failed to update address",
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
      <Card variant="ghost" style={{ 
        boxShadow: '0 9px 20px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'box-shadow 0.3s ease-in-out', 
      }}>
        <Flex justify="between" align="center">
          <Text size="6">Address Information</Text>
          <Button color="grass" onClick={() => setIsDialogOpen(true)}>
            <Edit sx={{ fontSize: "15px" }} />Edit
          </Button>
        </Flex>

        <Grid columns="2" gap="3" width="auto" p="10px" pl="20px">
          <DataList.Root>
            <DataList.Item>
              <DataList.Label>Postal Code</DataList.Label>
              <DataList.Value>{address?.CodePost || "N/A"}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>City</DataList.Label>
              <DataList.Value>{address?.City || "N/A"}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>State</DataList.Label>
              <DataList.Value>{address?.State || "N/A"}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Street Address</DataList.Label>
              <DataList.Value>{address?.StreetAddress || "N/A"}</DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Grid>
      </Card>

      {/* Address Edit Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content>
          <Dialog.Title>Edit Address</Dialog.Title>
          <Flex direction="column" gap="3">
            <RadixTextField.Root
              placeholder="Postal Code"
              value={newCodePost}
              onChange={(e) => setNewCodePost(Number(e.target.value))}
            />
            <RadixTextField.Root
              placeholder="City"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            />
            <RadixTextField.Root
              placeholder="State"
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
            />
            <RadixTextField.Root
              placeholder="Street Address"
              value={newStreetAddress}
              onChange={(e) => setNewStreetAddress(e.target.value)}
            />
            <Flex gap="3" justify="end">
              <Button color="gray" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Boxi>
  );
};

export default UserAddress;