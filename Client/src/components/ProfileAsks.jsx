import { useOutletContext } from "react-router-dom";
import SinglePost from "./SinglePost";
import { useState } from "react";

function ProfileAsks() {
  const { user, isSelf } = useOutletContext();
  const [visibleCount, setVisibleCount] = useState(5);
  if (!user || !user.questions) return <div className="text-gray-400">No questions found.</div>;
  // Filter out anonymous questions if not self
  const questionIds = isSelf
    ? user.questions
    : (user.questionsData || []).filter(q => !q.isAnonymous).map(q => q._id);

  // Infinite scroll/lazy loading (simple version)
  function handleLoadMore() {
    setVisibleCount((prev) => Math.min(prev + 5, questionIds.length));
  }

  return (
    <div className="ml-8">
      {questionIds.slice(0, visibleCount).map((qid) => (
        <div key={qid}>
          <SinglePost questionId={typeof qid === 'string' ? qid : qid._id} />
          {/* Show anonymous badge if question is anonymous */}
          {/* SinglePost fetches question data, so we need to fetch here or pass a prop. For now, show a placeholder badge below each post, to be conditionally rendered in SinglePost. */}
        </div>
      ))}
      {visibleCount < questionIds.length && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleLoadMore}
        >
          Load More
        </button>
      )}
    </div>
  );
}

export default ProfileAsks;
