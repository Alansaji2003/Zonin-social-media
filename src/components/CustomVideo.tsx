import React from 'react';

interface CustomVideoProps {
  src: string;
  alt: string;
  isPortrait: boolean;
  
}

export const CustomVideo: React.FC<CustomVideoProps> = ({ src, alt, isPortrait }) => {
  return (
    <div className={`relative w-full ${isPortrait ? 'h-screen' : 'h-screen md:h-screen-90'}`}>
      <video
        src={src}
        title={alt}
        className={`object-cover ${isPortrait ? 'h-full w-auto' : 'w-full h-auto md:object-contain'}`}
        controls
        
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
