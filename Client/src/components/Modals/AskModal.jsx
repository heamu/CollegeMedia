import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Upload from "../Upload";
import { deleteImage } from "../../utils/deleteImage";
import axios from "axios";
import { useAuth } from "../../context/useAuth";

const tags = [
  'CSE','ECE','Mechanical','Civil','EE','AI','GATE','Web Dev','Data Science','Internships','Placements','Robotics','DSA','ML',
  'DevOps', 'Blockchain', 'Android', 'Cloud', 'Cybersecurity', 'UI/UX', 'IOT', 'Quantum', 'AR/VR', 'Startups', 'Open Source', 'Competitive Coding', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Electronics', 'Automobile', 'Aerospace', 'Design', 'Product', 'Finance', 'Marketing', 'Entrepreneurship', 'Photography', 'Music', 'Art', 'Gaming', 'Sports', 'Yoga', 'Literature', 'Debate', 'Drama', 'Dance', 'Social Work', 'Travel', 'Cooking'
];

const AskModal = () => {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);
  const [question, setQuestion] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileId, setImageFileId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const uploadedFileIdRef = useRef("");
  const { setUser } = useAuth();

  function handleTagToggle(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  // Handle image upload success
  const handleImageUpload = (data) => {
    setImageUrl(data.url);
    setImageFileId(data.fileId);
    uploadedFileIdRef.current = data.fileId;
    setUploading(false);
    setProgress(0);
  };

  // Handle upload progress
  const handleUploadProgress = (percent) => {
    setProgress(percent);
    setUploading(percent > 0 && percent < 100);
  };

  // Delete uploaded image if modal closes and not posted
  const cleanupImage = async () => {
    if (uploadedFileIdRef.current && !imagePostedRef.current) {
      await deleteImage(uploadedFileIdRef.current);
      setImageUrl("");
      setImageFileId("");
      uploadedFileIdRef.current = "";
    }
  };

  // Track if image was posted
  const imagePostedRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupImage();
    };
  }, []);

  const closeModal = async () => {
    await cleanupImage();
    navigate("/");
  };

  // Handle delete image button
  const handleDeleteImage = async () => {
    if (imageFileId) {
      await deleteImage(imageFileId);
      setImageUrl("");
      setImageFileId("");
      uploadedFileIdRef.current = "";
    }
  };

  // Handle form submit
  const handleSubmit = async (e, isAnonymous = false) => {
    e.preventDefault();
    if (selectedTags.length === 0) {
      alert("Please select at least one tag for your question.");
      return;
    }
    if (!question.trim()) {
      alert("Question cannot be empty.");
      return;
    }
    if (imageUrl && !imageFileId) {
      alert("Image upload is not complete. Please wait or try again.");
      return;
    }
    try {
      // Post question to backend
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/ask-question`, {
        question,
        tags: selectedTags,
        imageUrl,
        imageFileId,
        isAnonymous,
      }, { withCredentials: true });
      imagePostedRef.current = true;
      if (res.data && res.data.user) {
        setUser(res.data.user);
        console.log(res.data.user);
      }
      navigate("/");
    } catch (err) {
      alert("Failed to post question");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-60">
      <div className="bg-[#0c0d23] p-6 rounded-lg h-[80vh] w-[65vw] overflow-y-auto relative shadow-lg">
        <button
          className="absolute top-2 right-3 text-blac text-xl"
          onClick={closeModal}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Ask a Question</h2>

        <form className="flex flex-col space-y-4" onSubmit={e => handleSubmit(e, false)}>
          {/* Question Textarea */}
          <textarea
            rows={8}
            placeholder="What do you want to ask?"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none p-3 border-b border-gray-700 focus:border-blue-500"
            required
          />

          {/* Image Upload Button */}
          <div className="flex items-center space-x-4">
            {!imageUrl ? (
              <Upload type="image" setProgress={handleUploadProgress} setData={handleImageUpload}>
                <span className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 py-2 rounded shadow hover:from-blue-800 hover:to-blue-600 transition-all duration-200 font-semibold text-base">
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4' />
                  </svg>
                  {uploading ? `Uploading... ${progress}%` : "Add Image"}
                </span>
              </Upload>
            ) : (
              <button type="button" onClick={handleDeleteImage} className="cursor-pointer flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded shadow hover:bg-red-800 transition-all duration-200 font-semibold text-base">
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
                Delete Image
              </button>
            )}
          </div>

          {imageUrl && (
            <div className="w-full">
              <img src={imageUrl} className="h-[50%] w-[50%] object-cover m-auto" alt="Uploaded" />
            </div>
          )}

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  selectedTags.includes(tag)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-800 text-gray-300 border-gray-600 hover:border-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Post Button Aligned to the Right */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={e => handleSubmit(e, true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Ask Anonymous
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskModal;