import UserDetails from "./UserDetails"

function SingleComment({ comment }) {
  if (!comment) return null;
  return (
    <div className="flex flex-col gap-2 mt-2">
      <UserDetails user={comment.author} />
      <div className="CommentContent pl-10 border-b-1 border-blue-600">
        <p className="text-gray-500 pb-1">{comment.body}</p>
      </div>
    </div>
  );
}

export default SingleComment;
