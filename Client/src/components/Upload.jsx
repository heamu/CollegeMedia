import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";

import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const authenticator = async () => {
  try {
    const res = await axios.get(`${baseUrl}/auth/imagekitio`, {
      withCredentials: true, // Ensure cookies/session are sent
    });
    const { signature, expire, token } = res.data;
    return { signature, expire, token };
  } catch (error) {
    console.error("Auth error:", error.message);
    throw error;
  }
};

function Upload({ children, type, setProgress, setData }) {
  const ref = useRef(null);

  const onError = (err) => {
    console.error("Upload failed:", err);
  };

  const onSuccess = (res) => {
    setData(res); // res.url res.fileId 
  };

  const onUploadProgress = (progress) => {
    if (setProgress) {
      const percent = Math.round((progress.loaded / progress.total) * 100);
      setProgress(percent);
    }
  };
// console.log('ImageKit URL Endpoint:', import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT);
  return (
    <IKContext
      publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <IKUpload
        useUniqueFileName
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
        ref={ref}
        accept={`${type}/*`}
      />
      <div className="cursor-pointer" onClick={() => ref.current.click()}>
        {children}
      </div>
    </IKContext>
  );
}

export default Upload;
