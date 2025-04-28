import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ChooseMeals from "../Assets/choose-image.png";
import DeliveryMeals from "../Assets/delivery-image.png";
import DetectDisease from "../Assets/logocolor.png";


const Work = () => {
    const navigate = useNavigate();
  const workInfoData = [
    {
      image: DetectDisease,
      title: "Detect Plant Diseases",
      text: "Easily upload a photo and get instant disease detection along with recommended treatments tailored to your plants.",
      cta: "Try Detection"
        ,nav:"/PlantDiseaseDetector"
    },
    {
      image: ChooseMeals,
      title: "Recommended Products",
      text: "Shop fertilizers, pesticides, and supplements specifically matched to your plant's needs, all in one place.",
      cta: "View Products"
      ,nav:"/Products"
    },
    {
      image: DeliveryMeals,
      title: "Track Your Orders",
      text: "Stay updated with real-time tracking from purchase to delivery, ensuring your plants get what they need on time.",
      cta: "Track Now"
      ,nav:"/order"
    },
  ];

  const cardVariants = {
    offscreen: {
      y: 20,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.6
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <Box py="8" px="4" >
 
      <Flex gap="5" wrap="wrap" justify="center" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {workInfoData.map((data, index) => (
          <motion.div
            key={data.title}
            initial="offscreen"
            whileInView="onscreen"
            whileHover="hover"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            transition={{ delay: index * 0.1 }}
            style={{ maxWidth: 350, width: '100%' }}
          >
            <Card 
              size="3" 
              style={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
                background: 'var(--gray-1)'
              }}
            >
              <Flex direction="column" gap="3" align="center" p="4">
                <img 
                  src={data.image} 
                  alt="" 
                  style={{ 
                    width: 120, 
                    height: 120, 
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-3)'
                  }} 
                />
                
                <Heading as="h3" size="5" align="center" style={{ fontWeight: 600 }}>
                  {data.title}
                </Heading>
                
                <Text as="p" size="3" color="gray" align="center">
                  {data.text}
                </Text>
                
                <button  onClick={() => navigate(data.nav)}
                 
                   className="secondary-button"
                 
                >
                  {data.cta}<FiArrowRight/>
                </button>
                
              </Flex>
            </Card>
          </motion.div>
        ))}
      </Flex>
    </Box>
  );
};

export default Work;