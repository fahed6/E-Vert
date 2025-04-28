import React from "react";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

const GrowItPage = () => {
  // Hydroponie menu items
  const hydroponieMenu = [
    { title: "Technique du film nutritif (NFT)", url: "#" },
    { title: "Culture sur radeaux flottants (RAFT)", url: "#" },
    { title: "Seaux Hollandais (Dutch Buckets)", url: "#" }
  ];

  // Partners data
  const partners = [
    { name: "giz", logo: "/partners/giz.png" },
    { name: "Mcovjee", logo: "/partners/mcovjee.png" },
    { name: "APiA", logo: "/partners/apia.png" }
  ];

  // Projects data
  const projects = [
    { 
      title: "Potager urbain - UBCI, Tunis", 
      image: "/projects/ubci.jpg",
      description: "Urban gardening solution for UBCI bank"
    },
    { 
      title: "Hydroponie - INPFCA, Sidi Thabet", 
      image: "/projects/inpfca.jpg",
      description: "Hydroponic system for agricultural institute"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">GIY, votre partenaire agricole !</h1>
          <div className="prose max-w-3xl text-gray-700">
            <p>
              Grow It Yourself, GIY, est une start-up spécialisée en agriculture hors-sol qui vise à améliorer 
              les rendements de l'agriculture durable en zones urbaines et rurales.
            </p>
            <p>
              Initiatrice d'innovations sociales, GIY fabrique, installe et assure la maintenance de systèmes 
              hydroponiques clé en main qui permettent de cultiver des produits alimentaires sans pesticide.
            </p>
            <p>
              Soucieuse de l'environnement, GIY renforce les compétences des acteurs locaux grâce à un panel 
              de formations adaptées à l'agriculture moderne.
            </p>
          </div>
        </section>

        {/* Edito Section */}
        <section className="mb-12 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Edito</h2>
          <blockquote className="italic text-gray-700 border-l-4 border-green-500 pl-4 py-2 mb-4">
            "Très vite j'ai fait le constat que les défis environnementaux et alimentaires auxquels va faire face 
            la région Afrique du Nord ne pourront être surmontés sans apporter des améliorations à nos techniques 
            d'agriculture traditionnelle. Sécheresse, dégradation des sols, augmentation de la population et des 
            besoins alimentaires... L'agriculture moderne y apporte des solutions et GIY se veut un leader dans 
            la région pour contribuer à les promouvoir."
          </blockquote>
          <p className="font-medium text-gray-900">Ilyes Saidani - Président fondateur</p>
        </section>

        {/* Partners Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Nos partenaires</h2>
          <div className="flex flex-wrap gap-8 items-center">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white p-4 rounded shadow-sm flex items-center justify-center">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="h-16 object-contain"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Projets réalisés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-green-100 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Idée de projet ?</h2>
          <p className="text-lg mb-6 text-gray-700">Nos experts vous répondent !</p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded">
            Consultation gratuite
          </button>
        </section>
      </div>

      {/* Sidebar */}
      <aside className="w-80 bg-white p-6 border-l border-gray-200">
        {/* Hydroponie Menu */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Hydroponie</h3>
          <ul className="space-y-2">
            {hydroponieMenu.map((item, index) => (
              <li key={index}>
                <a 
                  href={item.url} 
                  className="block py-2 text-gray-700 hover:text-green-600 transition-colors border-b border-gray-100"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Card */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="text-4xl text-green-600 mb-4">💡</div>
          <h3 className="text-xl font-semibold mb-2">Idée de projet ?</h3>
          <p className="text-gray-600 mb-4">Nos experts vous répondent !</p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-gray-700">(+216) 50 970 310</span>
            </div>
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-gray-700">info@growit-yourself.com</span>
            </div>
          </div>
          
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors">
            Contactez-nous
          </button>
        </div>
      </aside>
    </div>
  );
};

export default GrowItPage;