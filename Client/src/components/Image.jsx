import { IKImage } from 'imagekitio-react';

const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

const Image = ({ src, className, w, h, alt }) => {
  // If src is a full URL use src prop If not, use path prop.
  const isFullUrl = src && (src.startsWith('http://') || src.startsWith('https://'));
  return (
    <IKImage
      urlEndpoint={urlEndpoint}
      {...(isFullUrl ? { src } : { path: src })}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      width={w}
      height={h}
    />
  );
};

export default Image;
