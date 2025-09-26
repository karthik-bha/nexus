import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Forward, Heart, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {

  // const [posts, setPosts] = useState([{}]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  // const fetchPosts = async () => {
  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post/`, { method: "GET" });
  //     const data = await response.json();
  //     setPosts(data);
  //     console.log(data);
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const posts = [
    {
      "id": "65163158f92102875a5079a4",
      "imageUrl": "https://ik.imagekit.io/karthik426/Capture_KCfjLVIZq.PNG",
      "likes": 234,
      "comments": [
        "Wow, what a view!",
        "I wish I was there."
      ],
      "description": "Just a small glimpse into the vibrant life of the city. A beautiful view to start the day.",
      "user": {
        "id": "65163158f92102875a501234",
        "username": "janesmith",
        "profile_picture": "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
      },
      "createdAt": "2025-09-25T10:00:00.000Z"
    },
    {
      "id": "65163158f92102875a5079a5",
      "imageUrl": "https://ik.imagekit.io/karthik426/Capture_KCfjLVIZq.PNG",
      "likes": 512,
      "comments": [
        "Peaceful and serene.",
        "Looks like a great hike!",
        "Love the colors!"
      ],
      "description": "Lost in the woods, finding my way back to nature. There's nothing quite like the silence of a forest.",
      "user": {
        "id": "65163158f92102875a505678",
        "username": "wanderlust_mike",
        "profile_picture": "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
      },
      "createdAt": "2025-09-24T18:30:00.000Z"
    }
  ]

  // setPosts(mockPosts);
  // setLoading(false);

  // if (loading) return;
  return (
    <div className='justify-center text-center h-full w-full '>
      {posts?.length < 1 ? <div>
        <h3 className='text-4xl md:text-5xl pt-24 pb-6'>Welcome To Nexus.</h3>
        <p>Follow people to see their posts.</p>
      </div>
        :
        <div className='flex flex-col max-w-[80vw] md:max-w-[40vw] mx-auto p-6'>
          <h3 className='text-3xl md:text-3xl mb-4 text-center'>Feed</h3>
          {posts.map((post, index) => {
            return (
              <div key={post._id} className='mb-6 text-left border-2 max-w-[30vw] mx-auto p-2 rounded-2xl'>
                <div className='flex gap-2 items-center pb-2'>
                  <img src={post.user.profile_picture} className='w-7 h-7' />
                  <Link to={`/profile/${post.user.username}`}
                    target="_blank"
                    className='hover:cursor-pointer'>{post.user.username}</Link>
                </div>
                <img src={post.imageUrl} />
                <div className='pt-4 flex flex-col gap-2'>
                  <div className='flex gap-3 items-center'>
                    <Heart />
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