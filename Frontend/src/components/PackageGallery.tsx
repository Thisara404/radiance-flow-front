import React from 'react';
import { Link } from 'react-router-dom';
import ImageHoverPopup from './ImageHoverPopup';

interface Package {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
}

const packages: Package[] = [
  {
    id: 'gold',
    name: 'Gold Package',
    image: '/images/1.jpeg',
    description: 'Premium wedding dance choreography and training for couples',
    price: 'Rs. 27,000.00'
  },
  {
    id: 'silver',
    name: 'Silver Package',
    image: '/images/2.jpeg',
    description: 'Professional dance training for wedding couples',
    price: 'Rs. 15,000.00'
  },
  {
    id: 'platinum',
    name: 'Platinum Package',
    image: '/images/3.jpeg',
    description: 'VIP wedding dance experience with custom choreography',
    price: 'Rs. 35,000.00'
  },
  {
    id: 'performance',
    name: 'Performance Package',
    image: '/images/5.jpeg',
    description: 'Group performance training for special events',
    price: 'Rs. 20,000.00'
  },
  {
    id: 'group',
    name: 'Group Package',
    image: '/images/6.jpeg',
    description: 'Professional training for dance groups and teams',
    price: 'Rs. 18,000.00'
  },
  {
    id: 'wedding',
    name: 'Wedding Special',
    image: '/images/7.jpeg',
    description: 'Complete wedding dance solutions for the entire bridal party',
    price: 'Rs. 30,000.00'
  }
];

const PackageGallery: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white/20 backdrop-blur-sm animate-section">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Our Dance Packages
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white/70 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <div className="relative aspect-[4/3]">
                <ImageHoverPopup 
                  src={pkg.image} 
                  alt={pkg.name}
                  title={pkg.name}
                  price={pkg.price}
                  description={pkg.description}
                  thumbnailClassName="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold">{pkg.name}</h3>
                <p className="text-purple-600 font-semibold">{pkg.price}</p>
                <p className="text-gray-700 text-sm mt-1">{pkg.description}</p>
                <Link to={`/packages/${pkg.id}`}>
                  <button className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md py-2 text-sm font-medium">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackageGallery;