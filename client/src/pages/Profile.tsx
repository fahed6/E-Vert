// AdminDashboard.tsx
import {
    AccountCircle,
    Close as CloseIcon,
    ChevronLeft as CollapseIcon,
    EditLocationAlt,
    ChevronRight as ExpandIcon,
    LocalShipping,
    Menu as MenuIcon,
    Settings
} from '@mui/icons-material';
import {
    Box,
    Button,
    Flex,
    Heading,
    Text,
    Theme
} from '@radix-ui/themes';
import React, { useState } from 'react';
import UserAddress from '../components/UserAddress';
import UserOrders from '../components/UserOrders';
import UserProfile from '../components/UserProfile';

// Define types for menu items
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const Profile: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);

  const menuItems: MenuItem[] = [
    { id: 'Profile', label: 'Profile', icon: <Settings /> },
    { id: 'Address', label: 'Address', icon: <EditLocationAlt /> },
    { id: 'Orders', label: 'Orders', icon: <LocalShipping /> },
  ];

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSidebar = (): void => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const renderContent = (): React.ReactNode => {
    switch (activeMenu) {
      case 'Profile':
        return <UserProfile />;
      case 'Address':
        return <UserAddress />;
      case 'Orders':
        return <UserOrders />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <Theme appearance="light" accentColor="green">
      <Flex height="100vh">
        {/* Desktop Sidebar */}
        <Box 
          display={{ initial: 'none', md: 'block' }} 
          width={sidebarExpanded ? "180px" : "64px"} 
          p="4"
          style={{
            backgroundColor: "#4CAF50",
            transition: "width 0.3s ease"
          }}
        >
          <Flex direction="column" gap="6" height="100%">
            {sidebarExpanded ? (
              <Flex direction="column" align="center" gap="4">
                <Flex justify="center" style={{ width: '100%', padding: '8px 0' }}>
                  <AccountCircle style={{ 
                    color: 'white', 
                    fontSize: '80px',
                    margin: '0 auto'
                  }} />
                  <Button variant="ghost" onClick={toggleSidebar} style={{ color: 'white', padding: '4px', }}>
                    <CollapseIcon style={{ fontSize: '35px',}}/>
                  </Button>
                </Flex>
                
              </Flex>
            ) : (
              <Button variant="ghost" onClick={toggleSidebar} style={{ color: 'white', padding: '4px' }}>
                <ExpandIcon />
              </Button>
            )}
            
            <Flex direction="column" gap="1" style={{flex:"1"}}>
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
                    {sidebarExpanded && <Text size="3">{item.label}</Text>}
                  </Flex>
                </Button>
              ))}
            </Flex>
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
              <Heading size="5">Profile</Heading>
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

export default Profile;