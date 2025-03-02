import React, { useState, useEffect } from "react";
import { AddressService } from "../services/AddressService";
import useUserData from "../hooks/useUserData";
import { Box as Boxi, Button, Card, Text, Dialog, Flex, DataList, Grid, TextField as RadixTextField } from "@radix-ui/themes";
import { Edit } from "@mui/icons-material";

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
      alert("Address updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address.");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Boxi maxWidth="750px">
      <Card>
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