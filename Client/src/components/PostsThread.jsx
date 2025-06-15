import axios from 'axios';
import { useQuery } from 'react-query';
import SinglePost from "./SinglePost";
import LoadingSpinner from '../assets/Loading.svg';
import Failed from './Failed';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

function PostsThread() {
  // Fetch questions matching user's tags from backend
  const { data, isLoading, isError } = useQuery('feed-questions', async () => {
    const res = await axios.get(`${baseUrl}/question/feed`, { withCredentials: true });
    return res.data;
  });

  if (isLoading) return (
    <div className="ml-20 flex flex-col items-center justify-center h-32">
      <img src={LoadingSpinner} alt="Loading" className="w-12 h-12 animate-spin mb-2" />
      <span className="text-blue-400 text-lg font-medium mt-2">Loading questions...</span>
    </div>
  );
  if (isError) return <Failed message="Unable to load Questions" subMessage="Try reloading the page." />;
  if (!data || !data.questions || data.questions.length === 0) return (
    <div className="ml-20 flex flex-col items-center justify-center h-64 text-blue-300">
      <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-30" />
        <path d="M8 15h8M9 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-60" />
      </svg>
      <span className="text-xl font-semibold">No questions found</span>
      <span className="text-sm text-blue-200 mt-1">Try changing your tags or check back later.</span>
    </div>
  );

  return (
    <div className="relative ml-20 ">
      {data.questions.map((q) => (
        <SinglePost key={q._id} questionId={q._id} />
      ))}
    </div>
  );
}

export default PostsThread;
