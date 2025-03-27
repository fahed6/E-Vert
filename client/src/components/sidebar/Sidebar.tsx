import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Toolbar,
  ListItemButton,
  CircularProgress, 
} from "@mui/material";
import {
  AccountCircle as AccountIcon,
  LocationOn as LocationIcon,
  AdminPanelSettings as AdminIcon, 
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";
import './Sidebar.css';
import { checkAdmin } from "../../hooks/checkAdmin";

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
        <CircularProgress />
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