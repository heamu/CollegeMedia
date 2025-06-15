import SingleComment from "./SingleComment"

function Comments({ comments }) {
    if (!comments || comments.length === 0) return <div className="ml-10 text-gray-400">No comments yet.</div>;
    return (
        <div className="ml-10">
            {comments.map((comment) => (
                <SingleComment key={comment._id} comment={comment} />
            ))}
        </div>
    );
}

export default Comments
