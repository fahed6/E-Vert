import React, { useState } from 'react';
import {
  Button,
  Card,
  TextField,
  Flex,
  Heading,
  Text,
  Box
} from '@radix-ui/themes';
import Swal from 'sweetalert2';
import Footer from './Footer';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = `Contact Form Submission from ${formData.name}`;
    const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
    
    window.location.href = `mailto:mannoubi.fahed7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Swal.fire({
      title: 'Success!',
      text: 'Your email client will open. Please send the pre-filled email.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Box>
    <Box px="4" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Flex gap="6" align="stretch" wrap="wrap">
        {/* Contact Form Card */}
        <Card size="4" style={{ flex: 1, minWidth: 300 }}>
          <Heading as="h3" size="5" mb="4">
            Contact Us
          </Heading>

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4">
              <TextField.Root
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <TextField.Root
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <TextField.Slot>
                <textarea
                  placeholder="Message"
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-2)',
                    border: '1px solid var(--gray-a7)',
                    fontFamily: 'inherit',
                    fontSize: 'var(--font-size-2)'
                  }}
                />
              </TextField.Slot>

              <Button type="submit" size="3">
                Send Message
              </Button>

              <Text as="p" size="2" color="gray">
                Note: This will open your default email client.
              </Text>
            </Flex>
          </form>
        </Card>

        {/* Google Map Card */}
        <Card size="4" style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column' }}>
          <Heading as="h3" size="5" mb="4">
            Our Location
          </Heading>
          <div style={{ flex: 1 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12790.123456789012!2d10.73431!3d36.45105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDI3JzAzLjgiTiAxMMKwNDQnMDMuNSJF!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ 
                border: 0, 
                borderRadius: 'var(--radius-2)',
                minHeight: 400
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        
        </Card>
      </Flex>
      
    </Box>
    <div style={{ paddingTop:"20px", width:"101%" }}>
      <Footer />
      </div>
    </Box>
  );
};