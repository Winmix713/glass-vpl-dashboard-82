
import React, { useState, useEffect } from 'react';

interface MediaCardProps {
  title: string;
  videoSrc: string;
  isIframe?: boolean;
  aspectRatio?: 'video' | 'square' | '21/9';
  className?: string;
  description?: string;
  animationDelay?: number;
}

const EnhancedMediaCard: React.FC<MediaCardProps> = ({ 
  title, 
  videoSrc, 
  isIframe = false, 
  aspectRatio = 'video',
  className = '',
  description,
  animationDelay = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const aspectRatioClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    '21/9': 'aspect-[21/9]'
  }[aspectRatio];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 150);
    
    return () => clearTimeout(timer);
  }, [animationDelay]);

  return (
    <div 
      className={`rounded-lg text-card-foreground shadow-md overflow-hidden glass-card transition-all duration-500 ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col space-y-1.5 p-4 bg-gradient-to-r from-matt-100/50 to-matt-100/10">
        <h3 className="font-semibold tracking-tight text-lg">{title}</h3>
        {description && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
      </div>
      <div className={`relative p-0 ${aspectRatioClass} overflow-hidden`}>
        {isIframe ? (
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
        ) : (
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
    </div>
  );
};

export default EnhancedMediaCard;
