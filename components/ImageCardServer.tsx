// components/ImageCardServer.tsx
const ImageCardServer = ({ image, name }: { image: string; name: string }) => {
    return (
      <figure className="relative h-72 lg:h-full flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border p-1 border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-lg"
        />
        <noscript>
          <img src={image} alt={name} className="w-full h-full object-cover rounded-lg" />
        </noscript>
      </figure>
    );
  };
  
  export default ImageCardServer;
  