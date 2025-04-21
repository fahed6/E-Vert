
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/home-banner-image.png";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";


const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
   <div>
    <div className="home-container">
      
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
          Healthy Plants Happy Gardens Powered by Smart Detection
          </h1>
          <p className="primary-text">
          Detect plant diseases instantly and find the perfect products to keep your plants healthy effortlessly and reliably
          </p>
          <button 
  className="secondary-button" 
  onClick={() => navigate("/PlantDiseaseDetector")}
>
  Try Our AI <FiArrowRight />
</button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>

    <div style={{ paddingTop:"250px", width:"101%" }}>
      <Footer />
      </div>

    </div>
    
  );
};

export default HomePage;