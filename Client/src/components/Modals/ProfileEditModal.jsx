import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from '../Image';
import { useAuth } from "../../context/useAuth";
import Upload from "../Upload";
import axios from "axios";
import { deleteImage } from "../../utils/deleteImage";

const allTags =[
  'CSE','ECE','Mechanical','Civil','EE','AI','GATE','Web Dev','Data Science','Internships','Placements','Robotics','DSA','ML',
  'DevOps', 'Blockchain', 'Android', 'Cloud', 'Cybersecurity', 'UI/UX', 'IOT', 'Quantum', 'AR/VR', 'Startups', 'Open Source', 'Competitive Coding', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Electronics', 'Automobile', 'Aerospace', 'Design', 'Product', 'Finance', 'Marketing', 'Entrepreneurship', 'Photography', 'Music', 'Art', 'Gaming', 'Sports', 'Yoga', 'Literature', 'Debate', 'Drama', 'Dance', 'Social Work', 'Travel', 'Cooking'
];
const ProfileEditModal = () => {
  const navigate = useNavigate();
  const closeModal = () => navigate("/profile");
  const { user, setUser } = useAuth();

  // Pre-fill with current user data if available
  const [username, setUsername] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [selectedTags, setSelectedTags] = useState(user?.tags || []);
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [imageKitData, setImageKitData] = useState(null); // { url, fileId }
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [prevImageFileId, setPrevImageFileId] = useState(user?.imageFileId || "");

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  // Handle image upload success from Upload component
  const handleImageUpload = (data) => {
    // If previous image was an ImageKit image, store its fileId for deletion
    if (user?.imageFileId && user.profileImage && user.profileImage.startsWith("https://ik.imagekit.io/")) {
      setPrevImageFileId(user.imageFileId);
    }
    setProfileImage(data.url);
    setImageKitData(data);
    setIsUploading(false);
    setProgress(0);
    setUser(prev => prev ? { ...prev, profileImage: data.url, imageFileId: data.fileId } : prev);
  };

  // Handle upload progress
  const handleUploadProgress = (percent) => {
    setProgress(percent);
    setIsUploading(percent > 0 && percent < 100);
  };

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Delete previous image if needed
      if (
        prevImageFileId &&
        prevImageFileId !== (imageKitData?.fileId || user?.imageFileId || "") &&
        user?.profileImage &&
        user.profileImage.startsWith("https://ik.imagekit.io/")
      ) {
        await deleteImage(prevImageFileId);
      }
      const res = await axios.patch(
        `${baseUrl}/user/update-profile`,
        {
          name: username,
          bio,
          tags: selectedTags,
          profileImage,
          imageFileId: imageKitData?.fileId || user?.imageFileId || "",
        },
        { withCredentials: true }
      );
      if (res.data && res.data.user) {
        setUser(res.data.user);
      }
      closeModal();
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-gray-900 py-2 px-6 rounded-2xl w-full max-w-lg shadow-2xl relative mx-2">
        <button
          className="absolute top-3 right-4 text-white text-2xl hover:text-red-400 transition-colors"
          onClick={closeModal}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-white text-2xl font-bold my-1 text-center">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="text-white space-y-5">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-2">
            <label className="cursor-pointer flex flex-col items-center group" style={{overflow: 'visible'}}>
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-2 overflow-hidden" key={profileImage}>
                {profileImage ? (
                  profileImage.startsWith("https://lh3.googleusercontent.com/") ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      w={96}
                      h={96}
                      className="object-cover w-full h-full"
                    />
                  )
                ) : (
                  <img
                    src="/default-avatar.png"
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            </label>
            <Upload type="image" setProgress={handleUploadProgress} setData={handleImageUpload}>
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors mt-2" style={{overflow: 'visible', display: 'inline-block', whiteSpace: 'nowrap'}}>
                {isUploading ? 'Uploading...' : 'Change Image'}
              </span>
            </Upload>
            {isUploading && (
              <div className="text-xs text-blue-400 mt-1">Uploading: {progress}%</div>
            )}
            {imageKitData && (
              <div className="text-xs text-green-400 mt-1">Image uploaded!</div>
            )}
          </div>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none p-2 placeholder-gray-400 transition-colors"
            required
          />

          <textarea
            rows={1}
            placeholder="Bio"
            value={bio}
            onChange={e => {
              if (e.target.value.length <= 100) setBio(e.target.value);
            }}
            className="w-full bg-transparent border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none p-2 placeholder-gray-400 resize-none transition-colors"
            maxLength={100}
          />

          <div>
            <p className="mb-2 font-medium">Select Tags</p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full border text-sm focus:outline-none ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-800 text-gray-300 border-gray-600 hover:border-white"
                  }`}
                  style={{ boxShadow: 'none' }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white font-semibold transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
