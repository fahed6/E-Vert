import React from 'react';
import { Box, Flex, Text, Heading, TextField, Button } from '@radix-ui/themes';
import logo from '../assets/footer.png';
import backgroundimage from '../assets/footerbackground.png'; // Import the background image
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
    const navigate = useNavigate();
    return (
        <footer>
            <Box style={{ 
                position: 'relative', // Required for pseudo-element positioning
                borderTop: '1px solid var(--gray-6)',
                
                overflow: 'hidden', // Ensure the pseudo-element doesn't overflow
                height:"450px",
            }}>
                {/* Pseudo-element for the background image with opacity */}
                <Box style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${backgroundimage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.04, // Set opacity only for the background image
                    zIndex: 1, // Place it behind the content
                }} />

                {/* Footer content */}
                <Flex direction="column" style={{ position: 'relative', zIndex: 2 }}>
                    <Flex justify="between" align="center" wrap="wrap" gap="4">
                        {/* Right Side: Logo */}
                        <Box style={{ flexShrink: 0, marginLeft: 'auto',opacity:0.83 }}>
                            <img src={logo} alt="Logo" style={{ maxWidth: '450px', height: 'auto', paddingTop: "20px" }} />
                        </Box>

                        {/* Left Side: Contact Information, Social Media, and Community Form */}
                        <Flex direction="row" gap="4" style={{ flex: 1 }}>
                            {/* Contact Information */}
                            <Box>
                                <Heading as="h2" size="6" mb="2">Contact Us !</Heading>
                                <Text as="p" size="4" style={{ color: "#4d4d4d" }}><strong>Tel :</strong><span style={{color:"#2A7537"}}> (+216) 58 405 161 / 58 405 161</span></Text>
                                <Text as="p" size="4" style={{ color: "#4d4d4d" }}><strong>Mail :</strong><span style={{color:"#2A7537"}}> info@e-vert.com</span></Text>
                                <Text as="p" size="4" style={{ color: "#4d4d4d" }}><strong>Adress :</strong><span style={{color:"#2A7537"}}> 6 Rue emisel, Ariana</span></Text>
                                <Box style={{ paddingLeft: "20px", paddingTop: "33px" }}>
                                    <Heading as="h2" size="6" mb="2">Follow Us On E-vert Networks !</Heading>
                                    <InstagramIcon onClick={() => navigate("/home")} sx={{ color: "#2A7537", cursor: "pointer" }} />
                                    <FacebookIcon onClick={() => navigate("/home")} sx={{ color: "#2A7537", cursor: "pointer" }} />
                                    <LinkedInIcon onClick={() => navigate("/home")} sx={{ color: "#2A7537", cursor: "pointer" }} />
                                </Box>
                            </Box>

                            {/* Community Form */}
                            <Box width="350px">
                                <Heading as="h2" size="6" mb="2">Join Our Community !</Heading>
                                <Flex direction="column" gap="2">
                                    <TextField.Root size="3" placeholder=" Your Name" />
                                    <TextField.Root size="3" type="email" placeholder=" Your Email Address" />
                                    <Button onClick={() => navigate("/signup")} size="3" style={{ cursor: "pointer", width: "180px", marginLeft: "auto", backgroundColor: "#2A7537" }}>I'm Signing Up !</Button>
                                </Flex>
                            </Box>
                        </Flex>
                    </Flex>

                    {/* Centered text at the bottom of the footer */}
                    
                </Flex>
                <Flex justify="center" align="end" style={{paddingTop:"12%", paddingBottom: '20px', }}>
                        <Text style={{ textAlign: 'center' }}><strong>©2025 E-VERT</strong></Text>
                    </Flex>
            </Box>
            
        </footer>
    );
};

export default Footer;