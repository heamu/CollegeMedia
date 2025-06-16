import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import axios from "axios";
import CommentSVG from "../assets/Comment.svg";
import LikeSVG from "../assets/Like.svg";
import InvertedLikeSVG from "../assets/InvertedLike.svg";
import BookmarkSVG from "../assets/Bookmark.svg";
import InvertedBookmarkSVG from "../assets/InvertedBookmark.svg";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

function PostActions({ questionId, upvotes, comments, savedBy }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [fetchedComments, setFetchedComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [error, setError] = useState("");

  const isLiked = user && upvotes && upvotes.some(u => u.toString() === user._id);
  const isSaved = user && savedBy && savedBy.some(u => u.toString() === user._id);

  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes ? upvotes.length : 0);
  const [localSaved, setLocalSaved] = useState(isSaved);

  const savesCount = Array.isArray(savedBy) ? savedBy.length : 0;
  const [localSavedCount, setLocalSavedCount] = useState(savesCount);

  useEffect(() => {
    setLocalLiked(isLiked);
    setLocalUpvotes(upvotes ? upvotes.length : 0);
    setLocalSaved(isSaved);
    setLocalSavedCount(savesCount);
  }, [isLiked, upvotes, isSaved, savesCount]);

  const handleShowComments = async () => {
    setShowComments((prev) => !prev);
    if (!showComments && questionId) {
      setLoadingComments(true);
      setError("");
      try {
        const res = await axios.get(`${baseUrl}/question/${questionId}/comments`, { withCredentials: true });
        setFetchedComments(res.data.comments || []);
      } catch {
        setError("Failed to load comments");
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setAddingComment(true);
    setError("");
    try {
      const res = await axios.post(`${baseUrl}/question/${questionId}/comment`, { body: commentText }, { withCredentials: true });
      setFetchedComments([res.data.comment, ...fetchedComments]);
      setCommentText("");
    } catch {
      setError("Failed to add comment");
    } finally {
      setAddingComment(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    setLocalLiked((prev) => !prev);
    setLocalUpvotes((prev) => prev + (localLiked ? -1 : 1));
    try {
      const res = await axios.post(`${baseUrl}/question/${questionId}/like`, {}, { withCredentials: true });
      if (res.data.liked !== undefined) {
        setLocalLiked(res.data.liked);
        setLocalUpvotes(res.data.upvotes);
      }
    } catch {
      setLocalLiked(isLiked);
      setLocalUpvotes(upvotes ? upvotes.length : 0);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLocalSaved((prev) => !prev);
    setLocalSavedCount((prev) => prev + (localSaved ? -1 : 1));
    try {
      const res = await axios.post(`${baseUrl}/question/${questionId}/save`, {}, { withCredentials: true });
      if (res.data.saved !== undefined && typeof res.data.savesCount === 'number') {
        setLocalSaved(res.data.saved);
        setLocalSavedCount(res.data.savesCount);
      }
    } catch {
      setLocalSaved(isSaved);
      setLocalSavedCount(savesCount);
    }
  };

  function handleAnswerButton() {
    navigate(`/compose/${questionId}`);
  }

  return (
    <div className="py-1 flex flex-col gap-2">
      <div className="actions flex items-center w-full gap-6">
        {/* Comments */}
        <div onClick={handleShowComments} className="Comment flex gap-1 justify-around items-center cursor-pointer">
          <img src={CommentSVG} alt="CommentSVG" className="w-5 h-5" />
          {comments && comments.length > 0 && (
            <div className="text-xs text-gray-400">{comments.length}</div>
          )}
        </div>

        {/* Like */}
        <div className="Like flex gap-1 justify-around items-center cursor-pointer" onClick={handleLike}>
          <img src={localLiked ? InvertedLikeSVG : LikeSVG} alt="LikeSVG" className="w-5 h-5" />
          {localUpvotes > 0 && (
            <div className="text-xs text-gray-400">{localUpvotes}</div>
          )}
        </div>

        {/* Bookmark */}
        <div className="Bookmark flex gap-1 justify-around items-center cursor-pointer" onClick={handleSave}>
          <img src={localSaved ? InvertedBookmarkSVG : BookmarkSVG} alt="BookmarkSVG" className="w-5 h-5" />
          {localSavedCount > 0 && (
            <div className="text-xs text-gray-400">{localSavedCount}</div>
          )}
        </div>

        <div className="flex-1"></div>

        {/* Answer Button */}
        <div className="answer-button cursor-pointer ml-auto">
          <button onClick={handleAnswerButton} className="bg-[#0C63F0] text-white font-bold text-sm rounded-full py-1 px-4 flex items-center justify-center">Answer</button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-2 w-full">
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

          {loadingComments ? (
            <div className="text-blue-400">Loading comments...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : (
            <div className="max-h-40 overflow-y-auto mt-2">
              {fetchedComments.length === 0 ? (
                <div className="text-gray-400 italic text-center">No comments yet.</div>
              ) : (
                fetchedComments.map((c) => (
                  <div key={c._id} className="border-b border-gray-700 py-2">
                    <div className="text-sm text-white font-semibold">{c.author?.name || 'User'}</div>
                    <div className="text-xs text-gray-400">{c.body}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PostActions;


// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/useAuth";
// import axios from "axios";

// const baseUrl = import.meta.env.VITE_BACKEND_URL;

// function PostActions({ questionId, upvotes, comments, savedBy }) {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [showComments, setShowComments] = useState(false);
//   const [fetchedComments, setFetchedComments] = useState([]);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [commentText, setCommentText] = useState("");
//   const [addingComment, setAddingComment] = useState(false);
//   const [error, setError] = useState("");

//   // Check if current user liked or saved
//   const isLiked = user && upvotes && upvotes.some(u => u.toString() === user._id);
//   const isSaved = user && savedBy && savedBy.some(u => u.toString() === user._id);

//   // Local state for like/save and upvote count
//   const [localLiked, setLocalLiked] = useState(isLiked);
//   const [localUpvotes, setLocalUpvotes] = useState(upvotes ? upvotes.length : 0);
//   const [localSaved, setLocalSaved] = useState(isSaved);

//   // Calculate number of saves
//   const savesCount = Array.isArray(savedBy) ? savedBy.length : 0;
//   const [localSavedCount, setLocalSavedCount] = useState(savesCount);

//   // Update local state if props change (e.g. on navigation)
//   useEffect(() => {
//     setLocalLiked(isLiked);
//     setLocalUpvotes(upvotes ? upvotes.length : 0);
//     setLocalSaved(isSaved);
//     setLocalSavedCount(savesCount);
//   }, [isLiked, upvotes, isSaved, savesCount]);

//   // Fetch comments from backend
//   const handleShowComments = async () => {
//     setShowComments((prev) => !prev);
//     if (!showComments && questionId) {
//       setLoadingComments(true);
//       setError("");
//       try {
//         const res = await axios.get(`${baseUrl}/question/${questionId}/comments`, { withCredentials: true });
//         setFetchedComments(res.data.comments || []);
//       } catch {
//         setError("Failed to load comments");
//       } finally {
//         setLoadingComments(false);
//       }
//     }
//   };

//   // Add comment
//   const handleAddComment = async () => {
//     if (!commentText.trim()) return;
//     setAddingComment(true);
//     setError("");
//     try {
//       const res = await axios.post(`${baseUrl}/question/${questionId}/comment`, { body: commentText }, { withCredentials: true });
//       setFetchedComments([res.data.comment, ...fetchedComments]);
//       setCommentText("");
//     } catch {
//       setError("Failed to add comment");
//     } finally {
//       setAddingComment(false);
//     }
//   };

//   // Like/Unlike logic
//   const handleLike = async () => {
//     if (!user) return;
//     // Optimistically update UI
//     setLocalLiked((prev) => !prev);
//     setLocalUpvotes((prev) => prev + (localLiked ? -1 : 1));
//     try {
//       const res = await axios.post(`${baseUrl}/question/${questionId}/like`, {}, { withCredentials: true });
//       if (res.data.liked !== undefined) {
//         setLocalLiked(res.data.liked);
//         setLocalUpvotes(res.data.upvotes);
//       }
//     } catch {
//       // Revert on error
//       setLocalLiked(isLiked);
//       setLocalUpvotes(upvotes ? upvotes.length : 0);
//     }
//   };

//   // Save/Unsave logic
//   const handleSave = async () => {
//     if (!user) return;
//     setLocalSaved((prev) => !prev);
//     setLocalSavedCount((prev) => prev + (localSaved ? -1 : 1));
//     try {
//       const res = await axios.post(`${baseUrl}/question/${questionId}/save`, {}, { withCredentials: true });
//       if (res.data.saved !== undefined && typeof res.data.savesCount === 'number') {
//         setLocalSaved(res.data.saved);
//         setLocalSavedCount(res.data.savesCount);
//       }
//     } catch {
//       setLocalSaved(isSaved);
//       setLocalSavedCount(savesCount);
//     }
//   };

//   function handleAnswerButton() {
//     navigate(`/compose/${questionId}`);
//   }

//   return (
//     <div className="py-1 flex flex-col gap-2">
//       <div className="actions flex items-center w-full gap-6">
//         {/* Comments */}
//         <div onClick={handleShowComments} className="Comment flex gap-1 justify-around items-center cursor-pointer">
//           <img src="/src/assets/Comment.svg" alt="CommentSVG" className="w-5 h-5" />
//           {comments && comments.length > 0 && (
//             <div className="text-xs text-gray-400">{comments.length}</div>
//           )}
//         </div>
//         {/* Like */}
//         <div className="Like flex gap-1 justify-around items-center cursor-pointer" onClick={handleLike}>
//           <img src={localLiked ? "/src/assets/InvertedLike.svg" : "/src/assets/Like.svg"} alt="LikeSVG" className="w-5 h-5" />
//           {localUpvotes > 0 && (
//             <div className="text-xs text-gray-400">{localUpvotes}</div>
//           )}
//         </div>
//         {/* Bookmark */}
//         <div className="Bookmark flex gap-1 justify-around items-center cursor-pointer" onClick={handleSave}>
//           <img src={localSaved ? "/src/assets/InvertedBookmark.svg" : "/src/assets/Bookmark.svg"} alt="BookmarkSVG" className="w-5 h-5" />
//           {localSavedCount > 0 && (
//             <div className="text-xs text-gray-400">{localSavedCount}</div>
//           )}
//         </div>
//         {/* Spacer to push Answer button to the right */}
//         <div className="flex-1"></div>
//         {/* Answer Button (extreme right) */}
//         <div className="answer-button cursor-pointer ml-auto">
//           <button onClick={handleAnswerButton} className="bg-[#0C63F0] text-white font-bold text-sm rounded-full py-1 px-4 flex items-center justify-center">Answer</button>
//         </div>
//       </div>
//       {/* Comments Section */}
//       {showComments && (
//         <div className="mt-2 w-full">
//           <div className="flex flex-col gap-2 mb-2">
//             <input
//               type="text"
//               value={commentText}
//               onChange={e => setCommentText(e.target.value)}
//               placeholder="Add a comment..."
//               className="w-full bg-gray-800 text-white px-3 py-1 rounded mb-1 border border-gray-700 focus:outline-none"
//               disabled={addingComment}
//               onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }}
//             />
//             <button
//               onClick={handleAddComment}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm self-end"
//               disabled={addingComment || !commentText.trim()}
//             >
//               {addingComment ? 'Adding...' : 'Add Comment'}
//             </button>
//           </div>
//           {loadingComments ? (
//             <div className="text-blue-400">Loading comments...</div>
//           ) : error ? (
//             <div className="text-red-400">{error}</div>
//           ) : (
//             <div className="max-h-40 overflow-y-auto mt-2">
//               {fetchedComments.length === 0 ? (
//                 <div className="text-gray-400 italic text-center">No comments yet.</div>
//               ) : (
//                 fetchedComments.map((c) => (
//                   <div key={c._id} className="border-b border-gray-700 py-2">
//                     <div className="text-sm text-white font-semibold">{c.author?.name || 'User'}</div>
//                     <div className="text-xs text-gray-400">{c.body}</div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default PostActions;