import React, { useState } from 'react';
import ImageModal from './ImageModal';

interface ImageHoverPopupProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  price?: string;
  thumbnailClassName?: string;
}

const ImageHoverPopup: React.FC<ImageHoverPopupProps> = ({ 
  src, 
  alt,
  title,
  description,
  price, 
  thumbnailClassName 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="relative group" 
        onMouseEnter={() => setIsHovering(true)} 
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Thumbnail Image */}
        <img
          src={src}
          alt={alt}
          className={`cursor-pointer transition duration-200 ${thumbnailClassName || 'w-full h-full object-cover rounded-lg'}`}
        />

        {/* Hover Label - visible on both mobile and desktop */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            Click to view
          </div>
        </div>

        {/* Popup Image - only visible on desktop hover */}
        {isHovering && (
          <div className="absolute z-50 top-0 left-1/2 transform -translate-x-1/2 -translate-y-full pointer-events-none hidden md:block">
            <div className="bg-white p-2 rounded-lg shadow-xl popup-slide-in">
              <img 
                src={src} 
                alt={alt} 
                className="max-w-[400px] max-h-[500px] object-contain rounded"
              />
              {title && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white font-bold">{title}</h3>
                  {price && <p className="text-white font-semibold">{price}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal for mobile clicks */}
      <ImageModal
        src={src}
        alt={alt}
        title={title}
        description={description}
        price={price}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ImageHoverPopup;