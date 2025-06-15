import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import Upload from '../components/Upload';

function ComposeAnswer() {
  const { questionId } = useParams();
  const [questionText, setQuestionText] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (questionId) {
      fetch(`${baseUrl}/question/${questionId}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          setQuestionText(data.question?.body || data.question?.title || ''); // Prefer body, fallback to title
        })
        .catch(() => setQuestionText('Failed to load question.'));
    }
  }, [questionId, baseUrl]);
  const handleChange = (value) => {
    setContent(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/answer/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content,
          imageUrl,
          questionId,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit answer');
      alert('Answer posted successfully!');
      setContent('');
      setImageUrl('');
    } catch (err) {
      alert('Failed to post answer');
      console.error(err);
    }
  };

  const handleImageKitUpload = (res) => {
    setImageUrl(res.url);
    setUploading(false);
  };

  return (
    <div style={{ position: 'relative', isolation: 'isolate', zIndex: 10000, minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto mt-10 bg-gray-900 p-6 rounded-xl shadow-lg text-white relative border-2 border-blue-600">
        {/* Home Button */}
        <button
          className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold shadow"
          onClick={() => navigate('/')}
        >
          Home
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">Question</h2>
        <div className="bg-gray-800 p-5 rounded-md text-gray-200 mb-6 border-l-4 border-blue-500 leading-relaxed">
          <span className="font-bold text-lg">{questionText}</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block mb-2 text-lg font-medium text-gray-300">
            Your Answer
          </label>
          <div className="min-h-[200px]">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={handleChange}
              style={{ minHeight: '180px', height: '350px', maxHeight: '350px', overflowY: 'auto' }}
            />
          </div>
          {/* Image Preview */}
          {imageUrl && (
            <div className="flex flex-col items-center mt-4">
              <img src={imageUrl} alt="Answer Attachment" className="max-h-60 rounded-lg border-2 border-blue-500" />
              <button
                type="button"
                className="mt-2 text-xs text-red-400 hover:underline"
                onClick={() => { setImageUrl(""); }}
              >
                Remove Image
              </button>
            </div>
          )}
          {/* Add Image Button using Upload */}
          <div className="flex justify-end items-center mt-2">
            <Upload
              type="image"
              setProgress={setUploading}
              setData={handleImageKitUpload}
            >
              <button
                type="button"
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded shadow text-sm disabled:opacity-60"
                disabled={uploading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5v-9m-4.5 4.5h9" />
                </svg>
                {uploading ? "Uploading..." : "Add Image"}
              </button>
            </Upload>
          </div>
          <button
            type="submit"
            className="mt-6 bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition self-end"
          >
            Post
          </button>
        </form>
      </div>
      <style>{`
        /* Force Quill dropdown to always be visible and centered on the screen */
        .ql-toolbar .ql-picker.ql-expanded .ql-picker-options {
          position: fixed !important;
          left: 50% !important;
          top: 180px !important; /* Adjust as needed for your toolbar position */
          transform: translateX(-50%) !important;
          min-width: 180px !important;
          max-height: none !important;
          overflow-y: visible !important;
          z-index: 9999 !important;
          box-shadow: 0 2px 8px 0 #0004;
          background: #fff;
        }
      `}</style>
    </div>
  );
}

export default ComposeAnswer;
