import React, { useEffect, useState } from "react";
import { Heart, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import apiWrapper from "../api-wrapper/api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [feedType, setFeedType] = useState("discovery");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [liking, setLiking] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [commentLoading, setCommentLoading] = useState({});

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setPage(0);
    setLoading(true);
    fetchFeed(true);
  }, [feedType]);


  const fetchFeed = async (reset = false) => {
    try {
      const p = reset ? 0 : page;

      const res = await apiWrapper(
        `/post?type=${feedType}&page=${p}&size=${size}`,
        { method: "GET" }
      );

      if (!res.ok) {
        setError("Failed to load feed");
        setLoading(false);
        return;
      }

      const data = await res.json();

      // Spring PageImpl always returns content (even empty) — safe.
      const newPosts = Array.isArray(data.content) ? data.content : [];

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasMore(!data.last);
      setPage(p + 1);

    } catch (err) {
      console.error(err);
      toast.error("Unable to load feed");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      setCommentLoading(prev => ({ ...prev, [postId]: true }));

      const res = await apiWrapper(`/comments/${postId}`,{ method: "GET" });
      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setComments(prev => ({ ...prev, [postId]: data }));

    } catch {
      toast.error("Could not load comments");
    } finally {
      setCommentLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleAddComment = async (postId) => {
    const text = newComment[postId];
    if (!text?.trim()) return;

    try {
      setCommentLoading(prev => ({ ...prev, [postId]: true }));

      const response = await apiWrapper(`/comments/`, {
        method: "POST",
        body: JSON.stringify({ postId, comment: text }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed");

      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data],
      }));

      setNewComment(prev => ({ ...prev, [postId]: "" }));
      toast.success("Comment added!");

    } catch (err) {
      toast.error(err.message || "Failed to add comment");
    } finally {
      setCommentLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleLikes = async (id) => {
    setLiking(prev => ({ ...prev, [id]: true }));

    try {
      const response = await apiWrapper(`/post/${id}/like`, { method: "POST" });
      const message = await response.text();

      if (!response.ok) {
        toast.error("Failed to update likes");
        return;
      }

      setPosts(prev =>
        prev.map(p => {
          if (p.id !== id) return p;

          const likes = Array.isArray(p.likes) ? p.likes : [];
          const updated =
            message === "liked"
              ? [...likes, userId]
              : likes.filter(uid => uid !== userId);

          return { ...p, likes: updated };
        })
      );
    } catch {
      toast.error("Error updating likes");
    } finally {
      setLiking(prev => ({ ...prev, [id]: false }));
    }
  };

  // -------------------------------------------------
  // UI STATES
  // -------------------------------------------------

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f0f0f]">
        <p className="text-gray-400 text-lg animate-pulse">Loading your feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f0f0f] text-white">
        <p>{error}</p>
      </div>
    );
  }

  const noPosts = posts.length === 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans py-10">

      <div className="flex flex-col max-w-2xl mx-auto space-y-8">
        <h3 className="text-3xl font-semibold text-center mb-8 text-gray-100">
          Your Feed
        </h3>

        {/* FEED TYPE SWITCH */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setFeedType("following")}

            className={`px-5 py-2 rounded-full transition border hover:cursor-pointer ${feedType === "following"
              ? "bg-gray-100 text-black border-gray-300 font-semibold"
              : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-gray-500"
              }`}

          >
            Following
          </button>

          <button
            onClick={() => setFeedType("discovery")}

            className={`px-5 py-2 rounded-full transition border hover:cursor-pointer ${feedType === "discovery"
              ? "bg-gray-100 text-black border-gray-300 font-semibold"
              : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-gray-500"
              }`}

          >
            Discovery
          </button>
        </div>

        {/* EMPTY STATES */}
        {noPosts && (
          <div className="text-center text-gray-400 py-20">
            {feedType === "following" ? (
              <>
                <p className="text-lg">You aren&apos;t following anyone yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Follow people to see posts here.
                </p>
              </>
            ) : (
              <>
                <p className="text-lg">No posts found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Be the first to post something!
                </p>
              </>
            )}
          </div>
        )}

        {/* POSTS */}
        {posts.map((post) => (
          <div
            key={post.id}
            className="hover:-translate-y-1  duration-200 rounded-2xl bg-[#111] border border-[#262626] shadow-[0_0_10px_rgba(0,0,0,0.4)] p-6 hover:shadow-[0_0_18px_rgba(255,255,255,0.06)] transition"
          >
            {/* USER */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={
                  post.user?.profile_picture ||
                  "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
                }
                alt="pfp"
                className="w-9 h-9 rounded-full border border-gray-700"
              />
              <Link
                to={`/public-profile/${post.user?.username}`}
                className="font-medium text-gray-100"
              >
                {post.user?.username || "Unknown"}
              </Link>
            </div>

            {/* IMAGE */}
            <img
              src={post.imageUrl}
              alt="post"
              className="w-full max-h-[600px] object-cover rounded-xl border border-[#2a2a2a] bg-[#0f0f0f]"
            />


            {/* ACTIONS */}
            <div className="flex items-center gap-4 pt-3 text-gray-400">
              <button
                onClick={() => !liking[post.id] && handleLikes(post.id)}
                className={`flex items-center gap-1 transition ${post.likes?.includes(userId)
                  ? "text-red-500"
                  : "hover:text-red-500"
                  }`}
              >
                <Heart
                  size={20}
                  fill={post.likes?.includes(userId) ? "red" : "none"}
                />
                <span>{post.likes?.length || 0}</span>
              </button>

              <button
                onClick={() => {
                  if (!comments[post.id]) fetchComments(post.id);
                  else {
                    let copy = { ...comments };
                    delete copy[post.id];
                    setComments(copy);
                  }
                }}
               className="flex items-center gap-1 transition hover:text-gray-200"
              >
                <MessageSquare size={20} />
                <span>{post.commentCount || 0} comments</span>
              </button>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-3 text-gray-300 text-sm">{post.description}</p>

            {/* COMMENTS */}
            {comments[post.id] && (
              <div className="mt-4 bg-[#121212] border border-[#2a2a2a] rounded-xl p-3">
                {/* Add comment */}
                <div className="flex flex-wrap gap-2 mb-3">
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
                    className="flex-grow min-w-[200px] bg-[#1a1a1a] border border-[#333] rounded-lg p-2 placeholder-gray-500 focus:ring-1 focus:ring-gray-400 outline-none transition"
                  />

                  <button
                    onClick={() => handleAddComment(post.id)}
                    disabled={commentLoading[post.id]}
                    className="my-2 sm:my-0 px-3 md:px-5 py-2 bg-gray-100 text-black rounded-full font-medium hover:bg-gray-300 transition disabled:opacity-50"
                  >
                    Post
                  </button>
                </div>


                {/* List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {(comments[post.id] || []).map((c) => (
                    <div
                      key={c.id}
                      className="flex items-start gap-2 text-sm border-b border-[#2a2a2a] pb-2"
                    >
                      <img
                        src={
                          c.user?.profile_picture ||
                          "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
                        }
                        className="w-7 h-7 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-100">
                          {c.user?.username}
                        </p>
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

      {/* LOAD MORE */}
      {hasMore && !noPosts && (
        <button
          onClick={() => fetchFeed()}
         className="mx-auto mt-8 px-6 py-3 bg-gray-100 text-black rounded-full font-semibold hover:bg-gray-300 transition"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Dashboard;
