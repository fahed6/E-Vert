import {
  AccountCircle as AccountIcon,
  AdminPanelSettings as AdminIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { auth } from "../../config/firebase-config";
import { checkAdmin } from "../../hooks/checkAdmin";
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        
        const adminStatus = await checkAdmin();
        setIsAdmin(adminStatus);
      } else {
        
        setIsAdmin(false);
      }
      setIsLoading(false); 
    });

    
    return () => unsubscribe();
  }, []);

  
  const menuOptions = [
    {
      text: "Profile",
      icon: <AccountIcon />,
      onClick: () => navigate("profile"),
    },
    {
      text: "Address",
      icon: <LocationIcon />,
      onClick: () => navigate("address"),
    },
    {
      text: "Orders",
      icon: <LocationIcon />,
      onClick: () => navigate("orders"),
    },
  ];

  
  if (isAdmin) {
    menuOptions.push({
      text: "Admin",
      icon: <AdminIcon />,
      onClick: () => navigate("admin"),
    });
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show a loading spinner while checking admin status
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        
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
      </div>
    );
  }

  return (
    <>
      <Drawer
        variant="permanent" 
        open={isSidebarOpen}
        sx={{
          width: isSidebarOpen ? 240 : 60, 
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isSidebarOpen ? 240 : 60,
            overflowX: "hidden", 
          },
        }}
      >
        <Toolbar>
          <IconButton onClick={toggleSidebar}>
            {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <p><strong>dashboard</strong></p>
        </Toolbar>
        <Divider />
        <List>
          {menuOptions.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={item.onClick}>
                <ListItemIcon sx={{ color: "#2A7E3B" }}>{item.icon}</ListItemIcon>
                {/* Conditionally render text based on sidebar state */}
                {isSidebarOpen && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;