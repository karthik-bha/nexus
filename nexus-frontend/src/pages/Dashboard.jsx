import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Forward, Heart, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiWrapper from '../api-wrapper/api';
import { toast } from 'react-toastify';

const Dashboard = () => {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState({});


  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post/`, { method: "GET" });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      const data = await response.json();
      setPosts(data);
      console.log(data);
    } catch (err) {
      console.log(err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }
  if (error) {
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <h3 className='text-xl text-red-500 mb-4'>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  const handleLikes = async (id) => {
    setLiking(prev => ({ ...prev, [id]: true }));
    try {
      const response = await apiWrapper(`/post/${id}/like`, { method: "POST" });
      const message = await response.text();
      console.log(message);

      if (!response.ok) {
        toast.error(message);
        return;
      }

      if (message == null || message === "") {
        toast.error("Something went wrong while updating likes.");
        return;
      }

      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (!post || !post.id) return post;

          if (post.id === id) {
            const currentLikes = Array.isArray(post.likes) ? post.likes : [];
            const updatedLikes =
              message === "liked"
                ? [...currentLikes, "tempUserId"] // simulate adding a like
                : currentLikes.slice(0, -1); // safely remove one like

            return { ...post, likes: updatedLikes };
          }
          return post;
        })
      );
     
    } catch (err) {
      console.error("Error updating likes:", err);
      toast.error("Something went wrong while updating likes.");
    }
    finally {
      // Re-enable the like button
      setLiking(prev => ({ ...prev, [id]: false }));
    }
  };


  if (loading) return;
  return (
    <div className='justify-center text-center h-full w-full '>
      {posts?.length < 1 ? <div>
        <h3 className='text-4xl md:text-5xl pt-24 pb-6'>Welcome To Nexus.</h3>
        <p>Follow people to see their posts.</p>
      </div>
        :
        <div className='flex flex-col max-w-[80vw] md:max-w-[40vw] mx-auto p-6'>
          <h3 className='text-3xl md:text-3xl mb-4 text-center'>Your Feed</h3>
          {posts.map((post, index) => {
            return (
              <div key={post.id} className='mb-6 text-left border-2 max-w-[30vw] mx-auto p-2 rounded-2xl'>
                <div className='flex gap-2 items-center pb-2'>
                  <img src={post?.user?.profile_picture || "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"} className='w-7 h-7' />
                  <Link to={`/profile/${post?.user?.username}`}
                    target="_blank"
                    className='hover:cursor-pointer'>{post?.user?.username}</Link>
                </div>
                <img src={post?.imageUrl} />
                <div className='pt-4 flex flex-col gap-2'>
                  <div className='flex gap-3 items-center'>
                    <div className='flex gap-2 items-center'>
                      <Heart
                        onClick={() => !liking[post.id] && handleLikes(post.id)}
                        className={`${liking[post.id] ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      />

                      <p>{post.likes?.length}</p>
                    </div>
                    <MessageSquare />
                    <Forward />
                  </div>
                  <p>{post.description}</p>
                  <p className='text-gray-800'>{post.createdAt.slice(0, 10)}</p>
                </div>
              </div>
            )
          })}
        </div>
      }


    </div>
  )
}

export default Dashboard