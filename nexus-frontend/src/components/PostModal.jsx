import { useEffect, useState } from "react";
import { Heart, MessageSquare, X } from "lucide-react";
import apiWrapper from "../api-wrapper/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const PostModal = ({ post, onClose, userDetails , onDelete}) => {
    const [comments, setComments] = useState([]);
    const [commentLoading, setCommentLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [liking, setLiking] = useState(false);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchComments();
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const fetchComments = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/comments/${post.id}`
            );

            if (!res.ok) throw new Error("Failed to load comments");
            const data = await res.json();
            setComments(data);
        } catch (err) {
            toast.error("Error loading comments");
        }
    };

    const handleLike = async () => {
        if (!userId) return toast.error("Please log in to like posts.");

        setLiking(true);

        try {
            const response = await apiWrapper(`/post/${post.id}/like`, {
                method: "POST",
            });

            const message = await response.text();
            if (!response.ok) return toast.error("Failed to update like");

            // Update like count in modal (not in global state)
            if (message === "liked") {
                post.likes.push(userId);
            } else {
                post.likes = post.likes.filter((l) => l !== userId);
            }
        } catch {
            toast.error("Error liking post");
        } finally {
            setLiking(false);
        }
    };

    const handleAddComment = async () => {
        if (!userId) return toast.error("Please log in to comment.");

        if (!newComment.trim()) return;

        setCommentLoading(true);

        try {
            const res = await apiWrapper(`/comments/`, {
                method: "POST",
                body: JSON.stringify({
                    postId: post.id,
                    comment: newComment,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setComments((prev) => [...prev, data]);
            setNewComment("");
            toast.success("Comment added!");
        } catch (err) {
            toast.error("Failed to add comment");
        } finally {
            setCommentLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999]"
            onClick={onClose}>

            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-900 border border-neutral-800 rounded-xl w-[92%] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col sm:flex-row"
            >

                {/* IMAGE */}
                <div className="w-full sm:w-1/2 bg-black flex items-center justify-center">
                    <img
                        src={post.imageUrl}
                        alt="post"
                        className="max-h-[90vh] w-full object-contain"
                    />
                </div>

                {/* INFO SIDE */}
                <div className="w-full sm:w-1/2 flex flex-col">

                    {/* HEADER */}
                    <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                        <div className="flex items-center gap-3">
                            <img
                                src={userDetails?.profile_picture || "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"}
                                alt="pfp"
                                className="w-8 h-8 rounded-full border border-neutral-700"
                            />
                            <Link
                                to={`/public-profile/${post.user?.username}`}
                                className="font-semibold text-gray-200 hover:text-white"
                                onClick={onClose}
                            >
                                {userDetails?.username}
                            </Link>
                        </div>

                        <button
                            className="text-gray-400 hover:text-white"
                            onClick={onClose}
                        >
                            <X size={22} />
                        </button>
                    </div>

                    {/* COMMENTS */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                        {comments.map((c) => (
                            <div key={c.id} className="flex items-start gap-3">
                                <img
                                    src={
                                        c.user?.profile_picture ||
                                        "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
                                    }
                                    alt="pfp"
                                    className="w-7 h-7 rounded-full border border-neutral-700"
                                />
                                <div>
                                    <p className="font-semibold text-sm">{c.user?.username}</p>
                                    <p className="text-gray-400 text-sm">{c.comment}</p>
                                </div>
                            </div>
                        ))}

                        {comments.length === 0 && (
                            <p className="text-gray-500 text-sm text-center pt-10">
                                No comments yet.
                            </p>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="border-t border-neutral-800 p-4">
                        <div className="flex items-center gap-4 mb-3">
                            <button
                                onClick={handleLike}
                                disabled={liking}
                                className={`flex items-center gap-1 transition ${post.likes?.includes(userId)
                                    ? "text-red-500"
                                    : "hover:text-red-500"
                                    }`}
                            >
                                <Heart
                                    size={22}
                                    fill={post.likes?.includes(userId) ? "red" : "none"}
                                />
                                <span>{post.likes?.length || 0}</span>
                            </button>

                            <div className="flex items-center gap-1 text-gray-400">
                                <MessageSquare size={20} />
                                {post.commentCount} comments
                            </div>

                        </div>

                        {/* COMMENT INPUT */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={
                                    userId ? "Write a comment…" : "Login to comment"
                                }
                                className="flex-1 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-md text-gray-200 focus:ring-2 focus:ring-gray-600"
                                disabled={!userId}
                            />

                            <button
                                onClick={handleAddComment}
                                disabled={!userId || commentLoading}
                                className="px-4 py-2 bg-white text-black text-sm rounded-md disabled:bg-neutral-500 disabled:text-gray-300"
                            >
                                Post
                            </button>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            {/* DELETE button — only for owner */}
                            {post.userId === localStorage.getItem("userId") && (
                                <button
                                    onClick={() => onDelete(post.id)}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                >
                                    Delete
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostModal;
