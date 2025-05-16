
import React from 'react';
import EnhancedMediaCard from '@/components/cards/EnhancedMediaCard';

interface MediaSectionProps {
  media: {
    id: string;
    title: string;
    type: 'image' | 'video';
    source: string;
    duration?: string;
    views: string;
    badge?: string;
  }[];
}

const MediaSection: React.FC<MediaSectionProps> = ({ media }) => {
  return (
    <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6 card-entrance stagger-3">
      {media.map((item, index) => (
        <EnhancedMediaCard
          key={item.id}
          title={item.title}
          type={item.type}
          source={item.source}
          duration={item.duration}
          views={item.views}
          badge={item.badge}
        />
      ))}
    </div>
  );
};

export default MediaSection;
