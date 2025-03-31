// AdminDashboard.tsx
import {
    People as CustomersIcon,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    ShoppingCart as OrdersIcon,
    Groups as PartnersIcon,
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
import DashboardContent from './DashboardContent';
import CustomersContent from './CustomersContent';
import PartnersContent from './PartnersContent';
import ProductsContent from './ProductsContent';
import OrdersContent from './OrdersContent';
import SettingsContent from './SettingsContent';

// Define types for menu items
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const AdminDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'customers', label: 'Customers', icon: <CustomersIcon /> },
    { id: 'partners', label: 'Partners', icon: <PartnersIcon /> },
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
        return <DashboardContent />;
      case 'customers':
        return <CustomersContent />;
      case 'partners':
        return <PartnersContent />;
      case 'products':
        return <ProductsContent />;
      case 'orders':
        return <OrdersContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
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
                <Heading style={{color:"white"}} size="6">Admin Panel</Heading>
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
                {sidebarExpanded && <Text>Logout</Text>}
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
                  <Text>Logout</Text>
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

export default AdminDashboard;