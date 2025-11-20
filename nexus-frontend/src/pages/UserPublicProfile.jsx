import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import apiWrapper from "../api-wrapper/api";

const UserPublicProfile = () => {
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [sortBy, setSortBy] = useState("newest");

    const parseJavaDate = (str) => {
        const d = new Date(str);
        if (!isNaN(d)) return d;

        const parts = str.split(" ");
        const monthMap = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
        };

        const day = parts[2];
        const month = monthMap[parts[1]];
        const year = parts[5];
        const time = parts[3]; // HH:mm:ss

        return new Date(year, month, day, ...time.split(":"));
    };

    const sortPosts = (posts, type) => {
        switch (type) {
            case "oldest":
                return [...posts].sort(
                    (a, b) => parseJavaDate(a.createdAt) - parseJavaDate(b.createdAt)
                );
            case "most-liked":
                return [...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
            case "least-liked":
                return [...posts].sort((a, b) => (a.likes?.length || 0) - (b.likes?.length || 0));
            default:
                return [...posts].sort(
                    (a, b) => parseJavaDate(b.createdAt) - parseJavaDate(a.createdAt)
                );
        }
    };


    useEffect(() => {
        fetchPublicProfile();
    }, [username]);

    const fetchPublicProfile = async () => {
        setLoading(true);
        try {
            const resp = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/public/${username}`
            );

            if (resp.status === 404) {
                setError("User not found.");
                setLoading(false);
                return;
            }

            if (!resp.ok) {
                setError("Unable to load profile.");
                setLoading(false);
                return;
            }

            const data = await resp.json();
            setProfile(data.user);
            setPosts(data.posts);
        } catch (err) {
            console.error(err);
            setError("Network error. Try again later.");
        } finally {
            setLoading(false);
        }
    };
    const navigate = useNavigate();

    const startChat = async () => {

        if (profile?.id === localStorage.getItem("userId")) {
            toast.error("You cannot start a chat with yourself.");
            return;
        }

        try {
            const response = await apiWrapper("/chat/start", {
                method: "POST",
                body: JSON.stringify({
                    otherUserId: profile?.id
                })
            });

            const data = await response.json();

            if (data.chatId) {
                navigate(`/chat/${data.chatId}`);
            }
        } catch (err) {
            toast.error("Unable to start chat");
            console.error(err);
        }
    };
    const userId = localStorage.getItem("userId");
    const isFollowing = profile?.followers?.includes(userId);
    const handleFollow = async () => {
        try {
            await apiWrapper(`/follow/${profile.id}`, { method: "POST" });

            setProfile(prev => ({
                ...prev,
                followers: [...(prev.followers || []), userId],

            }));
        } catch (e) {
            toast.error("Failed to follow");
        }
    };

    const handleUnfollow = async () => {
        try {
            await apiWrapper(`/follow/unfollow/${profile.id}`, { method: "POST" });

            setProfile(prev => ({
                ...prev,
                followers: prev.followers?.filter(id => id !== userId) || [],

            }));
        } catch (e) {
            toast.error("Failed to unfollow");
        }
    };





    if (loading) return <Loader />;

    if (error)
        return (
            <div className="h-[80vh] flex items-center justify-center text-gray-400">
                {error}
            </div>
        );

    return (
        <section className="min-h-screen bg-neutral-950 text-gray-100 py-10 px-4">

            <div className="max-w-[900px] mx-auto space-y-8">

                {/* Profile Card */}
                <div className="
            bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl
            flex flex-col sm:flex-row items-center sm:items-start gap-6
            transition-all
        ">
                    <img
                        src={profile?.profile_picture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                        alt="Profile Picture"
                        className="w-24 h-24 rounded-full object-cover border border-gray-700 shrink-0"
                    />

                    <div className="text-center sm:text-left flex flex-col">
                        <h2 className="text-2xl font-semibold">{profile?.username}</h2>
                        {/* Only show buttons if NOT self-profile */}
                        {profile.id !== userId && (
                            <>
                                <button
                                    onClick={startChat}
                                    className="
        mt-3 px-3 py-1.5 rounded-md text-sm
        bg-neutral-800 border border-neutral-700 
        hover:bg-neutral-700 transition text-white
      "
                                >
                                    Message
                                </button>

                                <button
                                    onClick={isFollowing ? handleUnfollow : handleFollow}
                                    className="
        mt-2 px-3 py-1.5 rounded-md text-sm
        bg-neutral-800 border border-neutral-700
        hover:bg-neutral-700 transition text-white
      "
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </button>
                            </>
                        )}


                        <p className="text-gray-400 mt-1 max-w-[450px]">
                            {profile?.bio || "No bio added."}
                        </p>

                        <div className="flex flex-wrap gap-6 sm:gap-10 mt-3 text-sm text-gray-400 justify-center sm:justify-start">

                            <span>
                                <span className="text-gray-200 font-semibold">{posts.length}</span>{" "}
                                posts
                            </span>

                            <span>
                                <span className="text-gray-200 font-semibold">{profile?.followers?.length || 0}</span>{" "}
                                followers
                            </span>

                            <span>
                                <span className="text-gray-200 font-semibold">{profile?.following?.length || 0}</span>{" "}
                                following
                            </span>

                            <span>
                                Joined {new Date(profile?.created_at).toLocaleDateString()}
                            </span>
                        </div>

                    </div>
                </div>

                {/* Posts Card */}
                {/* Posts grid */}
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl">

                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold tracking-wide">Posts</h3>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-neutral-800 border border-neutral-700 text-gray-200 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-gray-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="most-liked">Most Liked</option>
                            <option value="least-liked">Least Liked</option>
                        </select>
                    </div>

                    {posts.length === 0 ? (
                        <p className="text-gray-500 text-center italic py-10">No posts yet.</p>
                    ) : (
                        <div
                            className="
                grid 
                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
                gap-4
            "
                        >
                            {sortPosts(posts, sortBy).map((post) => (
                                <div
                                    key={post.id}
                                    className="relative rounded-xl overflow-hidden border border-neutral-800 aspect-square"
                                >
                                    <img
                                        src={post.imageUrl}
                                        alt="post"
                                        className="w-full h-full object-cover transition duration-300 hover:scale-105"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>


            </div>

        </section >
    );
};

export default UserPublicProfile;
