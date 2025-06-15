import UserDetails from "./UserDetails";

function SinglePostHead({ author, createdAt }) {
  // Format date
  let timeAgo = "";
  if (createdAt) {
    const date = new Date(createdAt);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    if (diff < 60) timeAgo = `${diff}s ago`;
    else if (diff < 3600) timeAgo = `${Math.floor(diff / 60)}m ago`;
    else if (diff < 86400) timeAgo = `${Math.floor(diff / 3600)}h ago`;
    else timeAgo = `${Math.floor(diff / 86400)}d ago`;
  }
  return (
    <div className="border-b-2 pb-1 border-blue-500 h-14 flex text-white justify-between items-end">
      <UserDetails user={author} />
      <div className="h-8 font-extralight text-slate-400 cursor-default text-xs">
        {timeAgo}
      </div>
    </div>
  );
}

export default SinglePostHead;
