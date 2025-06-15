import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserDetails from "../UserDetails";
import Comments from "../Comments";
import Image from "../Image"; // Adjust the import based on your file structure
import axios from "axios";
import { useAuth } from "../../context/useAuth";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

function AnswerModel() {
  const navigate = useNavigate();
  const { answerid } = useParams();
  const { user } = useAuth();
  const [answerData, setAnswerData] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [showComments, setshowComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userUpvoted, setUserUpvoted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (answerid) {
      fetch(`${baseUrl}/answer/${answerid}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          setAnswerData(data.answer);
          setUpvotes(data.answer?.upvotes?.length || 0);
          setComments(data.answer?.comments || []);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load answer.');
          setLoading(false);
        });
    }
  }, [answerid]);

  useEffect(() => {
    if (answerData && answerData.upvotes && user) {
      // Check if the logged-in user has liked this answer
      const liked = answerData.upvotes.some(
        (u) => u.toString() === user._id
      );
      setUserUpvoted(liked);
    } else {
      setUserUpvoted(false);
    }
  }, [answerData, user]);

  // Like/Unlike logic
  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await axios.post(`${baseUrl}/answer/${answerid}/like`, {}, { withCredentials: true });
      if (res.data.liked !== undefined) {
        setUserUpvoted(res.data.liked);
        setUpvotes(res.data.upvotes);
      }
    } catch {
      // fallback: toggle UI only
      setUserUpvoted((prev) => {
        const newVal = !prev;
        setUpvotes((u) => u + (newVal ? 1 : -1));
        return newVal;
      });
    }
  };

  // Add comment logic
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setAddingComment(true);
    try {
      const res = await axios.post(`${baseUrl}/answer/${answerid}/comment`, { body: commentText }, { withCredentials: true });
      setComments([res.data.comment, ...comments]);
      setCommentText("");
    } catch {
      // Optionally show error
    } finally {
      setAddingComment(false);
    }
  };

  const onClose = () => {
    navigate("/");
  }

  if (loading) return <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-60"><div className="text-white">Loading...</div></div>;
  if (error || !answerData) return <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-60"><div className="text-red-400">{error || 'Answer not found.'}</div></div>;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-60">
      <div className="bg-[#0c0d23] p-6  rounded-lg h-[80vh] w-[65vw] overflow-y-auto relative shadow-lg">
        {/* Close Button */}
        <button
          className="absolute cursor-pointer top-2 right-3 text-white text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        {/* User Details */}
        <div className="mb-6">
          <UserDetails user={answerData.author} />
        </div>
        {/* Blue divider */}
        <div className="w-full h-1 bg-blue-600 rounded mb-6"></div>
        {/* Answer Content */}
        <div className="min-h-72">
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <p className="text-white mb-4 text-base leading-relaxed" style={{padding: '0.5rem 0.75rem'}} dangerouslySetInnerHTML={{ __html: answerData.body }} />
          </div>
          {/* Image */}
          {answerData.imageUrl && answerData.imageUrl.startsWith('http') ? (
            <div className="mb-4">
              <img
                src={answerData.imageUrl}
                alt="Answer Related"
                className="w-full h-auto rounded-lg"
              />
            </div>
          ) : answerData.imageUrl ? (
            <div className="mb-4">
              <Image
                src={answerData.imageUrl}
                alt="Answer Related"
                className="w-full h-auto rounded-lg"
                height={400}
                width={600}
              />
            </div>
          ) : null}
        </div>
        {/* Upvote Section */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-3">
            <div className="flex gap-2">
              <button className="text-gray-400" onClick={() => { setshowComments(!showComments) }}>
                <img src="../src/assets/Comment.svg" alt="Comment" className="w-5 h-5 cursor-pointer" />
              </button>
              <div className="noofcomments text-gray-400 text-sm">{comments.length}</div>
            </div>
            {/* Upvote like PostActions */}
            <div className="Like flex gap-1 justify-around items-center cursor-pointer" onClick={handleLike}>
              <img src={userUpvoted ? "/src/assets/InvertedLike.svg" : "/src/assets/Like.svg"} alt="LikeSVG" className="w-5 h-5" />
              {upvotes > 0 && (
                <div className="text-xs text-gray-400">{upvotes}</div>
              )}
            </div>
          </div>
        </div>
        {showComments && (
          <div className="mt-4 w-full">
            <div className="flex flex-col gap-2 mb-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-gray-800 text-white px-3 py-1 rounded mb-1 border border-gray-700 focus:outline-none"
                disabled={addingComment}
                onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }}
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm self-end"
                disabled={addingComment || !commentText.trim()}
              >
                {addingComment ? 'Adding...' : 'Add Comment'}
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto mt-2">
              {comments.length === 0 ? (
                <div className="text-center text-gray-400 italic py-4 text-base">
                  No comments yet.
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="border-b border-gray-700 py-2 flex items-start gap-2">
                    <img src={c.author?.profileImage || '/default-avatar.png'} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="text-sm text-white font-semibold">{c.author?.name ? (c.author.name.length > 10 ? c.author.name.slice(0, 8) + '..' : c.author.name) : 'User'}</div>
                      <div className="text-xs text-gray-400">{c.body}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnswerModel;