
import React, { useState } from 'react';
import { MediaCardProps } from '@/types';

interface MediaCardComponentProps extends MediaCardProps {
  className?: string;
}

const MediaCard: React.FC<MediaCardComponentProps> = ({ 
  title, 
  videoSrc, 
  isIframe = false,
  description,
  className = '' 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`rounded-lg border text-card-foreground shadow-lg overflow-hidden glass-card transition-all duration-300 border-white/10 backdrop-blur-md ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col space-y-1.5 p-4 bg-gradient-to-r from-matt-100/50 to-matt-100/10 border-b border-white/5">
        <h3 className="font-semibold tracking-tight text-lg">{title}</h3>
      </div>
      <div className={`relative p-0 aspect-video overflow-hidden`}>
        {!isIframe ? (
          <>
            <video 
              src={videoSrc} 
              className="h-full w-full object-cover transition-transform duration-700 ease-in-out"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              autoPlay 
              loop 
              playsInline 
              muted
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-matt/80 to-transparent opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}></div>
          </>
        ) : (
          <>
            <iframe 
              src={videoSrc} 
              className="h-full w-full" 
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen
            />
            <div className={`absolute inset-0 border-2 border-transparent transition-all duration-300 ${isHovered ? 'border-app-blue/30' : ''}`}></div>
          </>
        )}
        
        {/* Overlay controls that appear on hover */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-12 h-12 rounded-full bg-app-blue/20 backdrop-blur-md flex items-center justify-center border border-white/20 transform transition-transform duration-300 hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
      </div>
      
      {description && (
        <div className="p-4 pt-2 border-t border-white/5">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}
    </div>
  );
};

export default MediaCard;
