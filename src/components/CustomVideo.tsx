import React from 'react';

interface CustomVideoProps {
  src: string;
  alt: string;

  
}

export const CustomVideo: React.FC<CustomVideoProps> = ({ src, alt }) => {
  return (
    <div >
      <video
        src={src}
        title={alt}
        controls    
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
