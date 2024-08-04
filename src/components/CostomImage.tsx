import Image from "next/image";

interface CustomImageProps {
  src: string;
  alt: string;
  isPortrait: boolean;
  sizes?: string;
}

export const CustomImage: React.FC<CustomImageProps> = ({ src, alt, isPortrait,sizes}) => {
  return (
    <div className={`relative w-full ${isPortrait ? 'h-screen' : 'h-screen md:h-screen-90'}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${isPortrait ? 'h-full w-auto' : 'w-full h-auto md:object-contain'}`}
        sizes={sizes}
        
      />
    </div>
  );
};
