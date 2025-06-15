import { useNavigate } from "react-router-dom"
import { useQuery } from 'react-query';

function UserAnswer({ answerId }) {
    const navigate  = useNavigate();
    // Use react-query to fetch answer details and cache them
    const { data, isLoading } = useQuery(
        ['answer', answerId],
        async () => {
            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            const res = await fetch(`${baseUrl}/answer/${answerId}`, { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch answer');
            return res.json();
        },
        { enabled: !!answerId }
    );

    const userName = data?.answer?.author?.name || 'User';
    const upvotes = data?.answer?.upvotes?.length || 0;

    // Truncate username for display (e.g., first 6 chars + '..')
    let displayName = userName;
    if (userName && userName.length > 8) {
        displayName = userName.slice(0, 6) + '..';
    }

    function handleAnswer(){
        navigate(`/answer/${answerId}`);
    }
    return (
        <div onClick={handleAnswer} className="bg-gray-800 cursor-pointer min-w-20 w-40 rounded-2xl  p-2 px-4 text-sm flex justify-between items-center font-bold">
            <div className="username">
                @{isLoading ? '...' : <span>{displayName}</span>}
            </div>
            <div className="Upvotes text-xs">
                <div className="upvotes flex justify-center items-center gap-1">
                    <div className="text-xs text-gray-400">{isLoading ? '...' : upvotes}</div>
                    <div>
                        <img src="/src/assets/Upvote.svg" alt="Upvotes" className="invert-100 w-3" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAnswer
