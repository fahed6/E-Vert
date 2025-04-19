import React, { useState } from 'react';
import axios from 'axios';
import { Theme, Flex, Text, Heading, Card, Inset } from '@radix-ui/themes';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { DiseaseResponse } from '../types/DiseaseResponse';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
});

const PlantDiseaseDetector: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post('http://localhost:5001/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewDetection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <Theme appearance="light">
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        {!result ? (
          <Card>
            <Flex direction="column" gap="4" p="4">
              <Heading as="h1" size="5" align="center" color="green">
                Plant Disease Detection
              </Heading>

              <form onSubmit={handleSubmit}>
                <Flex direction="column" gap="4">
                  <Flex direction="column" gap="2">
                    <Text as="label" size="2" weight="bold">
                      Upload Plant Image
                    </Text>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      component="label"
                      sx={{ width: 'fit-content' }}
                    >
                      Choose File
                      <VisuallyHiddenInput 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                      />
                    </Button>
                    {selectedFile && (
                      <Text size="2" color="gray">
                        Selected: {selectedFile.name}
                      </Text>
                    )}
                  </Flex>

                  {previewUrl && (
                    <Inset clip="padding-box" side="top" pb="current">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{
                          display: 'block',
                          objectFit: 'cover',
                          width: '100%',
                          maxHeight: 300,
                          borderRadius: 'var(--radius-2)',
                        }}
                      />
                    </Inset>
                  )}

                  <Flex justify="center">
                    <Button 
                      type="submit" 
                      variant="contained"
                      disabled={loading || !selectedFile}
                      color="success"
                      sx={{ mt: 2 }}
                    >
                      {loading ? (
                        <Flex align="center" gap="2">
                          <CircularProgress size={16} color="inherit" />
                          Analyzing...
                        </Flex>
                      ) : (
                        'Detect Disease'
                      )}
                    </Button>
                  </Flex>
                </Flex>
              </form>

              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
            </Flex>
          </Card>
        ) : (
          <Flex direction="column" gap="4">
            {/* Recommended Treatment Card - Now at the top */}
            <Card>
              <Flex direction="column" gap="4" p="4">
                <Heading as="h2" size="4" color="green">
                  Recommended Treatment
                </Heading>
                <Flex gap="4" align="center">
                  <Box sx={{ width: 120, height: 120 }}>
                    <img
                      src={result.supplement_image_url}
                      alt={result.supplement_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-2)',
                      }}
                    />
                  </Box>
                  <Flex direction="column" gap="2" flexGrow="1">
                    <Heading as="h3" size="3">
                      {result.supplement_name}
                    </Heading>
                    <Button
                      variant="contained"
                      href={result.supplement_buy_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="success"
                      size="large"
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Buy Now
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </Card>

            {/* Detection Result Card */}
            <Card>
              <Flex direction="column" gap="4" p="4">
                <Flex justify="between" align="center">
                  <Heading as="h2" size="4" color="red">
                    Detection Result: {result.disease_name}
                  </Heading>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={handleNewDetection}
                  >
                    New Detection
                  </Button>
                </Flex>

                <Box sx={{ mb: 2 }}>
                  <img
                    src={result.disease_image_url}
                    alt={result.disease_name}
                    style={{
                      width: '100%',
                      height: 300,
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-2)',
                    }}
                  />
                </Box>

                <Flex direction="column" gap="3">
                  <Box>
                    <Heading as="h3" size="3" mb="2">
                      Description
                    </Heading>
                    <Text as="p" size="2">
                      {result.description}
                    </Text>
                  </Box>

                  <Box>
                    <Heading as="h3" size="3" mb="2">
                      Prevention
                    </Heading>
                    <Text as="p" size="2">
                      {result.prevention}
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Card>
          </Flex>
        )}
      </Box>
    </Theme>
  );
};

export default PlantDiseaseDetector;