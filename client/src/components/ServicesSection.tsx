import { Mail, Phone } from "@mui/icons-material";
import React from "react";
import Image1 from "../Assets/p1.jpeg";
import Image2 from "../Assets/485282970_1047016290796513_4458929669617560940_n.jpg";
import Image3 from "../Assets/484092227_1047016307463178_2922050171621659908_n.jpg";
import Image4 from "../Assets/Logo-New-WebSite-GIY4.png";
import { useNavigate } from "react-router-dom";



const GrowItPage = () => {
  const navigate = useNavigate();
  // Hydroponie menu items


  // Partners data
  const partners = ["Grow It Yourself",];

  // Projects data
  const projects = [
    { 
      title: "Potager urbain - UBCI, Tunis", 
      description: "Urban gardening solution for UBCI bank",
      image:Image2
    },
    { 
      title: "Hydroponie - INPFCA, Sidi Thabet", 
      description: "Hydroponic system for agricultural institute",
      image:Image3
    }
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      
    }}>
      {/* Sidebar (Left - 25% width) */}
      <aside style={{
        width: '25%',
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRight: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Hydroponie Menu */}


        {/* Contact Card */}
        <div style={{
          backgroundColor: '#003300',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            fontSize: '2.25rem',
            color: 'white',
            marginBottom: '1rem'
          }}>
            💡
          </div>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '0.5rem'
          }}>
Project idea?          </h3>
          <p style={{ color: 'white', marginBottom: '1.5rem' }}>
          Our experts answer you!
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
              <Phone sx={{ color: "white" }}/>
              <span style={{ color: 'white' }}> (+216) 58 405 161</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Mail sx={{ color: "white" }}/>
              <span style={{ color: 'white' }}> info@e-vert.com</span>
            </div>
          </div>
          
          <button onClick={() => navigate("/contact")} style={{
            width: '100%',
            backgroundColor: 'white',
            color: 'white',
            fontWeight: '500',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>
            <span style={{color:"black"}}>Contact-us</span>
          </button>
        </div>
      </aside>

      {/* Main Content (75% width) */}
      <main style={{
        flex: 1,
        padding: '2rem',
        position: 'relative'
      }}>
        {/* Hero Section with Image */}
        <div style={{
          display: 'flex',
          marginBottom: '3rem',
          position: 'relative'
        }}>
          <div style={{ flex: 1, maxWidth: '40%', height:'920px' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1.5rem'
            }}>
              E-Vert, Your Agricultural Partner !
            </h1>
            <div style={{ color: '#374151', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '1rem' }}>
                Our platform is designed to serve both farmers and agricultural product vendors. On one hand, it assists users in identifying plant diseases through image-based diagnosis powered by artificial intelligence. On the other hand, it provides smart recommendations for appropriate products, such as fertilizers or treatments, directly linked to the detected issues.</p>
              <p style={{ marginBottom: '1rem' }}>
              In addition, the platform includes a fully integrated online store where users can browse, add to cart, and order products, while vendors and administrators manage inventory and deliveries.</p>
              <p>
                 

The motivation behind this project stems from the recurring issues faced by farmers, especially in rural or under-resourced areas, where access to expert advice or quick solutions for plant diseases can be limited. By offering a digital assistant capable of both detection and recommendation, the platform bridges a critical gap between problem identification and resolution.</p>
            </div>
          </div>
          
          {/* Hero Image */}
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '50%',
            height: '100%',
            backgroundColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            borderRadius: '0.5rem',
            overflow: 'hidden'
          }}>
            <img src={Image1} />
          </div>
        </div>

        {/* Edito Section */}
        <section style={{
          marginBottom: '3rem',
           background: 'var(--gray-1)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          width: '60%',
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Edito
          </h2>
          <blockquote style={{
            fontStyle: 'italic',
            color: '#374151',
            borderLeft: '4px solid #10b981',
            paddingLeft: '1rem',
            marginBottom: '1rem'
          }}>
            "I quickly realized that the environmental and food challenges facing the North African region cannot be overcome without improvements to our traditional agricultural techniques. Drought, soil degradation, increasing population and food needs... Modern agriculture provides solutions, and GIY aims to be a leader in the region to help promote them."
          </blockquote>
          <p style={{ fontWeight: '500', color: '#111827' }}>
          Fahed Mannoubi - Founding President
          </p>
        </section>

        {/* Partners Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
Our partners          </h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            alignItems: 'center'
          }}>
            {partners.map((partner, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                height: '5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontWeight: '500', color: '#374151' }}>{partner}</span>
                <div style={{width:"90px"}}> <img src={Image4}/></div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
Completed projects          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {projects.map((project, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  backgroundColor: '#e5e7eb',
                  height: '12rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280'
                }}>
                  <img src={project.image} />
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    color: 'white',
                    marginBottom: '0.5rem'
                  }}>
                    {project.title}
                  </h3>
                  <p style={{ color: 'white', }}>{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          backgroundColor: '#d1fae5',
          padding: '2rem',
          borderRadius: '0.5rem',
          border: '1px solid #a7f3d0'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Project idea?
          </h2>
          <p style={{ color: '#374151', marginBottom: '1.5rem' }}>
          Our experts answer you!          </p>
          <button style={{
            backgroundColor: '#10b981',
            color: 'white',
            fontWeight: '500',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>
            Free consultation
          </button>
        </section>
      </main>
    </div>
  );
};

export default GrowItPage;