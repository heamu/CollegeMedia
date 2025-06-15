import { useQuery } from 'react-query';
import SinglePostHead from "./SinglePostHead";
import PostActions from "./PostActions";
import UserAnswer from "./UserAnswer";
import { useState } from "react";
import Comments from "./Comments";
import { useAuth } from "../context/useAuth";

function SinglePost({ questionId }) {
  const [showComments, setshowComments] = useState(false);
  const { user } = useAuth();

  // Fetch question data using React Query
  const { data, isLoading, isError } = useQuery(
    ['question', questionId],
    async () => {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${baseUrl}/question/${questionId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch question');
      return res.json();
    },
    { enabled: !!questionId }
  );

  function handleComments() {
    setshowComments((prev) => !prev);
  }

  if (isLoading) return (
    <div className="bg-slate-950 text-white min-h-72 z-0 px-10 py-5 w-[48rem] my-10 border-2 border-blue-500 rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full animate-flash-wave pointer-events-none">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-flash-wave-inner" />
      </div>
    </div>
  );
  if (isError || !data || !data.question) return <div className="bg-slate-950 text-white min-h-72 z-0 px-10 py-5 w-[48rem] my-10 border-2 border-blue-500 rounded-2xl">Failed to load post.</div>;

  const q = data.question;

  // Determine if viewer is the author
  const isAuthor = user && q.author && user._id === q.author._id;

  return (
    <div className="bg-slate-950 text-white min-h-72 z-0 px-10 py-5 w-[48rem] my-10 border-2 border-blue-500 rounded-2xl">
      {/* Show author info only if not anonymous or viewer is author */}
      {(!q.isAnonymous || isAuthor) ? (
        <SinglePostHead author={q.author} createdAt={q.createdAt} />
      ) : (
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block bg-gray-700 text-gray-200 text-xs font-semibold px-2 py-1 rounded-full">Anonymous</span>
          <span className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleString()}</span>
        </div>
      )}
      {/* Anonymous badge */}
      {q.isAnonymous && (
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-block bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded-full">Asked Anonymously</span>
        </div>
      )}
      <div className="questionarea min-h-40 border-b-[1px] border-gray-200 text-white font-semibold text-lg pt-4">
        {q.body}
        {q.imageUrl && (
          <div className="mt-4"><img src={q.imageUrl} alt="Question" className="max-w-full max-h-60 rounded-lg" /></div>
        )}
      </div>
      <div className="PostBottom">
        <div className="answerscontainer grid grid-cols-3 gap-4 my-5">
          {q.answers && q.answers.length > 0 ? (
            q.answers.map((aid) => (
              <UserAnswer key={aid} answerId={aid} />
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-400 italic py-4">
              No answers yet. Be the first to answer!
            </div>
          )}
        </div>
        <PostActions 
          handleComments={handleComments} 
          questionId={q._id}
          upvotes={q.upvotes}
          comments={q.comments}
          savedBy={q.savedBy}
        />
        {showComments && (
          <div className="mt-2 h-40 overflow-y-auto">
            <Comments comments={q.comments} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SinglePost;
