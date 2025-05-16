
import React from 'react';

interface MediaCardProps {
  title: string;
  mediaType: 'video' | 'iframe';
  src: string;
  aspectRatio?: 'video' | 'square' | '21/9';
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  title, 
  mediaType, 
  src, 
  aspectRatio = 'video' 
}) => {
  const aspectRatioClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    '21/9': 'aspect-[21/9]'
  }[aspectRatio];

  return (
    <div className="rounded-lg border text-card-foreground shadow-sm overflow-hidden glass-card">
      <div className="flex flex-col space-y-1.5 p-4">
        <h3 className="font-semibold tracking-tight text-lg">{title}</h3>
      </div>
      <div className={`p-0 ${aspectRatioClass}`}>
        {mediaType === 'video' ? (
          <video 
            src={src} 
            className="h-full w-full object-cover" 
            autoPlay 
            loop 
            playsInline 
            muted
          />
        ) : (
          <iframe 
            src={src} 
            className="h-full w-full" 
            frameBorder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

export default MediaCard;
