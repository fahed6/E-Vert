// AdminDashboard.tsx
import {
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    ShoppingCart as OrdersIcon,
    Inventory as ProductsIcon,
    Settings as SettingsIcon,
    Close as CloseIcon,
    ChevronLeft as CollapseIcon,
    ChevronRight as ExpandIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Flex,
    Heading,
    Theme,
    Text
} from '@radix-ui/themes';
import React, { useState } from 'react';
import PartnerDashboardContent from './PartnerDashboardContent';
import ProductsContent from './ProductsContent';
import OrdersContent from '../OrdersContent';
import UserProfile from '../../UserProfile';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../config/firebase-config';

// Define types for menu items
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const PartnerDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
    const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'products', label: 'Products', icon: <ProductsIcon /> },
    { id: 'orders', label: 'Orders', icon: <OrdersIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSidebar = (): void => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const renderContent = (): React.ReactNode => {
    switch (activeMenu) {
      case 'dashboard':
        return <PartnerDashboardContent />;
      case 'products':
        return <ProductsContent />;
      case 'orders':
        return <OrdersContent />;
      case 'settings':
        return <UserProfile />;
      default:
        return <PartnerDashboardContent />;
    }
  };
  const handleLogout = async () => {
      try {
        await signOut(auth); // Sign out the user
        localStorage.removeItem("firebaseIdToken"); // Remove the token from localStorage
        navigate("/login"); // Redirect to the login page
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };

  return (
    <Theme appearance="light" accentColor="green">
      <Flex height="100vh">
        {/* Desktop Sidebar */}
        <Box 
          display={{ initial: 'none', md: 'block' }} 
          width={sidebarExpanded ? "240px" : "64px"} 
          p="4"
          style={{
            backgroundColor: "#4CAF50", // Grass green
            transition: "width 0.3s ease"
          }}
        >
          <Flex direction="column" gap="6" height="100%">
            {sidebarExpanded ? (
              <Flex justify="between" align="center">
                <Heading style={{color:"white"}} size="6">Partner Panel</Heading>
                <Button variant="ghost" onClick={toggleSidebar} style={{ color: 'white', padding: '4px' }}>
                  <CollapseIcon />
                </Button>
              </Flex>
            ) : (
              <Button variant="ghost" onClick={toggleSidebar} style={{ color: 'white', padding: '4px' }}>
                <ExpandIcon />
              </Button>
            )}
            
            <Flex direction="column" gap="1" style={{flex:"1"}} >
              {menuItems.map((item) => (
                <Button 
                  key={item.id}
                  variant={activeMenu === item.id ? "solid" : "ghost"}
                  onClick={() => setActiveMenu(item.id)}
                  style={{ 
                    justifyContent: sidebarExpanded ? "flex-start" : "center", 
                    color: activeMenu === item.id ? 'white' : 'rgba(255, 255, 255, 0.85)',
                    backgroundColor: activeMenu === item.id ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                  }}
                >
                  <Flex align="center" gap="2">
                    {item.icon}
                    {sidebarExpanded && <Text>{item.label}</Text>}
                  </Flex>
                </Button>
              ))}
            </Flex>
            
            <Button variant="ghost" style={{ 
              justifyContent: sidebarExpanded ? "flex-start" : "center", 
              color: 'rgba(255, 255, 255, 0.7)' 
            }}>
              <Flex align="center" gap="2">
                <LogoutIcon />
                {sidebarExpanded && <Text onClick={handleLogout}>Logout</Text>}
              </Flex>
            </Button>
          </Flex>
        </Box>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <Box 
            display={{ md: 'none' }}
            position="fixed"
            top="0"
            left="0"
            width="100%"
            height="100%"
            p="4"
            style={{backgroundColor:"#4CAF50", zIndex:"10"}}
          >
            <Flex direction="column" gap="6" height="100%">
              <Flex justify="between" align="center">
                <Heading style={{color:"white"}} size="6">Admin Panel</Heading>
                <Button variant="ghost" onClick={toggleMobileMenu} style={{ color: 'white' }}>
                  <CloseIcon />
                </Button>
              </Flex>
              
              <Flex direction="column" gap="1" style={{ flex:"1" }}>
                {menuItems.map((item) => (
                  <Button 
                    key={item.id}
                    variant={activeMenu === item.id ? "solid" : "ghost"}
                    onClick={() => {
                      setActiveMenu(item.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{ 
                      justifyContent: "flex-start", 
                      color: activeMenu === item.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: activeMenu === item.id ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                    }}
                  >
                    <Flex align="center" gap="2">
                      {item.icon}
                      <Text>{item.label}</Text>
                    </Flex>
                  </Button>
                ))}
              </Flex>
              
              <Button variant="ghost" style={{ justifyContent: "flex-start", color: 'rgba(255, 255, 255, 0.7)' }}>
                <Flex align="center" gap="2">
                  <LogoutIcon />
                  <Text onClick={handleLogout}>Logout</Text>
                </Flex>
              </Button>
            </Flex>
          </Box>
        )}

        {/* Main Content */}
        <Box style={{flex:"1"}} overflow="auto">
          {/* Mobile Header */}
          <Box 
            display={{ md: 'none' }} 
            p="4" 
            style={{
              backgroundColor:"white", 
              borderBottom:"1px solid", 
              borderColor:"gray"
            }}
          >
            <Flex justify="between" align="center">
              <Heading size="5">Admin Panel</Heading>
              <Button variant="ghost" onClick={toggleMobileMenu}>
                <MenuIcon />
              </Button>
            </Flex>
          </Box>

          {/* Content Area */}
          <Box p="4">
            {renderContent()}
          </Box>
        </Box>
      </Flex>
    </Theme>
  );
};

export default PartnerDashboard;