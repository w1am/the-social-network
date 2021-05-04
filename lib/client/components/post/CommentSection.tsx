import React from "react";

interface Comment {
  comment: string;
  username: string;
}

interface CommentSectionProps {
  comments: Comment[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  return (
    <div
      className="py-3 pb-0 border-t-2 border-gray-700 mt-4"
    >
      {comments.map(({ comment, username }, index: number) => (
        <div
          key={index}
          className="text-white bg-gray-700 px-4 py-2 rounded-xl w-max mb-2 last:mb-0"
        >
          <p className="text-sm font-semibold">{username}</p>
          <p className="text-sm">{comment}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
