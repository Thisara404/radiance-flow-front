import React from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  price?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  src, 
  alt, 
  title, 
  description, 
  price, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <img 
            src={src} 
            alt={alt} 
            className="w-full aspect-video object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/70 transition"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        {(title || description || price) && (
          <div className="p-4">
            {title && <h3 className="text-lg font-bold">{title}</h3>}
            {price && <p className="text-purple-600 font-semibold">{price}</p>}
            {description && <p className="text-gray-700 mt-2">{description}</p>}
            
            <div className="mt-4 flex justify-end">
              <button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-pink-700 transition"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;