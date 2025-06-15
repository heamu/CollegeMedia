import { useAuth } from '../context/useAuth';
import SinglePost from '../components/SinglePost';
import NavBar from '../components/NavBar';

function SavedPosts() {
    // Get saved post IDs for the current user from context
    const { user } = useAuth();
    const savedPosts = user?.savedPosts || [];

    if (!user) return <div className="ml-20 text-gray-400">Loading saved posts...</div>;

    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50 bg-[#0c0d23]">
                <NavBar />
            </div>
            <div className="pt-24 pb-4 flex flex-col items-center justify-center w-full">
                <h1 className="text-4xl font-extrabold text-blue-300 mb-8 tracking-wide drop-shadow-lg uppercase">Saved Posts</h1>
            </div>
            {savedPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-gray-400">
                    <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-4 opacity-60">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5v14l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                    </svg>
                    <span className="text-lg font-semibold">No saved posts yet</span>
                    <span className="text-sm text-gray-500 mt-1">Start saving questions to see them here!</span>
                </div>
            ) : (
                <div className="relative flex flex-col items-center justify-center w-full pt-0">
                    {savedPosts.map((questionId) => (
                        <SinglePost key={questionId} questionId={questionId} />
                    ))}
                </div>
            )}
        </>
    );
}

export default SavedPosts;
