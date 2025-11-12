import React, { useEffect, useState } from "react";
import { Forward, Heart, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import apiWrapper from "../api-wrapper/api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liking, setLiking] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [commentLoading, setCommentLoading] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post/`);
      if (!response.ok) throw new Error("Failed to load posts");
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      setCommentLoading((prev) => ({ ...prev, [postId]: true }));
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/comments/${postId}`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments((prev) => ({ ...prev, [postId]: data }));
    } catch {
      toast.error("Could not load comments");
    } finally {
      setCommentLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleAddComment = async (postId) => {
    const text = newComment[postId];
    if (!text || text.trim() === "") return;

    try {
      setCommentLoading((prev) => ({ ...prev, [postId]: true }));

      const response = await apiWrapper(`/comments/`, {
        method: "POST",
        body: JSON.stringify({ postId, comment: text }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add comment");

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data],
      }));
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.message || "Failed to add comment");
    } finally {
      setCommentLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleLikes = async (id) => {
    setLiking((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await apiWrapper(`/post/${id}/like`, { method: "POST" });
      const message = await response.text();

      if (!response.ok || !message) {
        toast.error("Failed to update likes");
        return;
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === id) {
            const likes = Array.isArray(post.likes) ? post.likes : [];
            const updatedLikes =
              message === "liked"
                ? [...likes, "tempUser"]
                : likes.slice(0, -1);
            return { ...post, likes: updatedLikes };
          }
          return post;
        })
      );
    } catch {
      toast.error("Error updating likes");
    } finally {
      setLiking((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#faf3e0]">
        <p className="text-gray-600 text-lg tracking-wide animate-pulse">
          Loading your feed...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#faf3e0]">
        <h3 className="text-2xl text-red-500 mb-2 font-semibold">Oops!</h3>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans py-10">
      <div className="flex flex-col max-w-2xl mx-auto space-y-8">
        <h3 className="text-3xl font-semibold text-center mb-4 tracking-tight text-gray-100">
          Your Feed
        </h3>

        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-3xl border border-[#2a2a2a] bg-[#1a1a1a] shadow-md hover:shadow-lg hover:border-gray-500 transition-all p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={post?.user?.profile_picture || "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"}
                alt="pfp"
                className="w-9 h-9 rounded-full border border-gray-700"
              />
              <Link
                to={`/profile/${post?.user?.username}`}
                className="font-medium text-gray-100 hover:text-white transition"
              >
                {post?.user?.username}
              </Link>
            </div>

            <img
              src={post?.imageUrl}
              alt="post"
              className="rounded-2xl w-full border border-[#2a2a2a] shadow-sm hover:scale-[1.01] transition-transform"
            />

            <div className="flex items-center gap-4 pt-3 text-gray-400">
              <button
                onClick={() => !liking[post.id] && handleLikes(post.id)}
                disabled={liking[post.id]}
                className={`flex items-center gap-1 transition ${liking[post.id]
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:text-red-500"
                  }`}
              >
                <Heart size={20} />
                <span>{post.likes?.length}</span>
              </button>

              <button
                onClick={() => {
                  if (!comments[post.id]) fetchComments(post.id);
                  else
                    setComments((prev) => {
                      const updated = { ...prev };
                      delete updated[post.id];
                      return updated;
                    });
                }}
                className="flex items-center gap-1 hover:text-blue-400 transition"
              >
                <MessageSquare size={20} />
                <span>{post.commentCount} comments</span>
              </button>

              <Forward
                size={20}
                className="ml-auto text-gray-500 hover:text-green-400 transition"
              />
            </div>

            <p className="mt-3 text-gray-300 text-sm leading-snug">{post.description}</p>

            {comments[post.id] && (
              <div className="mt-4 bg-[#121212] border border-[#2a2a2a] rounded-xl p-3">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newComment[post.id] || ""}
                    onChange={(e) =>
                      setNewComment((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    placeholder="Write a comment..."
                    className="flex-grow border border-[#3a3a3a] rounded-lg p-2 text-sm bg-[#1e1e1e] text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    disabled={commentLoading[post.id]}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${commentLoading[post.id]
                        ? "bg-gray-600 cursor-not-allowed text-gray-300"
                        : "bg-white text-black hover:bg-gray-300"
                      }`}
                  >
                    Post
                  </button>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {(comments[post.id] || []).map((c) => (
                    <div
                      key={c.id}
                      className="flex items-start gap-2 text-sm border-b border-[#2a2a2a] pb-2"
                    >
                      <img
                        src={c.user?.profile_picture || "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"}
                        alt="commenter"
                        className="w-7 h-7 rounded-full border border-[#3a3a3a]"
                      />
                      <div>
                        <p className="font-medium text-gray-100">{c.user?.username || "User"}</p>
                        <p className="text-gray-400">{c.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-3">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>


  );
};

export default Dashboard;
