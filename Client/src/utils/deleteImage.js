import axios from "axios";

export const deleteImage = async (fileId) => {
  try {
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    // eslint-disable-next-line no-unused-vars
    const res = await axios.post(`${baseUrl}/auth/delete-img`, {
      fileId,
    }, { withCredentials: true }); // Ensure credentials are sent for auth
    //console.log("Image deleted:", res.data);
  } catch (err) {
    console.error("Error deleting image:", err.response?.data || err.message);
  }
};



