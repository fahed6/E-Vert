import { useState } from "react";
import Logo from "../Assets/e-vert_LOGO.png";
import { BsCart2 } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase-config";
import { signOut } from "firebase/auth";

import { Button} from '@radix-ui/themes';

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("firebaseIdToken"); // Check if the user is authenticated

  const menuOptions = [
    {
      text: "Home",
      icon: <HomeIcon />,
      onClick: () => navigate("/home"),
    },
    {
      text: "About",
      icon: <InfoIcon />,
      onClick: () => navigate("/about"),
    },
    {
      text: "Testimonials",
      icon: <CommentRoundedIcon />,
      onClick: () => navigate("/testimonials"),
    },
    {
      text: "Contact",
      icon: <PhoneRoundedIcon />,
      onClick: () => navigate("/contact"),
    },
    {
      text: "Cart",
      icon: <ShoppingCartRoundedIcon />,
      onClick: () => navigate("/cart"),
    },
  ];

  const handleLogin = () => {
    navigate("/login"); // Redirect to the login page
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
    
    <nav>
      <div className="nav-logo-container">
      <a href="/home">  <img src={Logo} alt="Logo" style={{ height: '40px' }}/></a>
      </div>
      <div className="navbar-links-container">
        <a href="/home"> Home</a>
        <a href="/about">About</a>
        <a href="/testimonials">Testimonials</a>
        <a href="/contact">Contact</a>
        <a href="/cart">
          <BsCart2 className="navbar-cart-icon" />
        </a>
        {isAuthenticated ? (
          <Button  onClick={handleLogout} className="left">
            Logout
          </Button>
        ) : (
          <Button  onClick={handleLogin} className="left">
            Login
          </Button>
        )}
      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={item.onClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={isAuthenticated ? handleLogout : handleLogin}>
                <ListItemIcon>
                  {isAuthenticated}
                </ListItemIcon>
                <ListItemText primary={isAuthenticated ? "Logout" : "Login"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </nav>
  );
};

export default  Header;