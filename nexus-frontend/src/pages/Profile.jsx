import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Profile = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else if (response.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.replace("/");
      } else {
        toast.error("Failed to load profile data.");
        setError("Unable to fetch your profile. Try again later.");
      }
    } catch (e) {
      console.error(e);
      setError("Network error while fetching your details.");
      toast.error("Network error — please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fallbackPfp = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center text-gray-400 py-20">
        <p>{error}</p>
      </div>
    );

  const formattedDate = new Date(profileData?.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="max-w-[1200px] mx-auto flex flex-col py-12 px-4 text-white">
      <h2 className="text-3xl text-center font-semibold tracking-wide mb-12 ">Profile</h2>

      <div className="flex flex-col items-center bg-[#111] border-[#262626]
        rounded-xl p-8 shadow-xl gap-6 w-full md:w-[40vw] mx-auto">
        <img
          src={profileData?.profile_picture || fallbackPfp}
          alt="profile"
          className="h-32 w-32 rounded-full object-cover border border-[#333] shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          loading="lazy"
          onError={(e) => (e.target.src = fallbackPfp)}
        />

        <div className="flex flex-col gap-3 text-center">
          <p className="text-xl font-medium">{profileData?.username || "Anonymous User"}</p>
          <p className="text-gray-400">{profileData?.email || "No email found"}</p>
          <p
            className={`text-sm ${profileData?.bio ? "text-gray-300" : "italic text-gray-500"
              }`}
          >
            {profileData?.bio || "No bio added yet"}
          </p>

          <button
            onClick={() => window.location.href = "/settings"}
            className="hover:cursor-pointer mt-4 px-5 py-2 bg-gray-100 text-black font-semibold rounded-full hover:bg-gray-300 transition"
          >
            Settings
          </button>
          <button
            onClick={() => window.location.href = `/public-profile/${profileData?.username}`}
            className="hover:cursor-pointer mt-2 px-5 py-2 border border-gray-500 rounded-full text-gray-300 hover:bg-neutral-800 transition">
            View your Public Profile
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Joined on {formattedDate}
          </p>
        </div>
      </div>

      <p className="text-center text-gray-600 mt-10 italic">
        Thanks for being part of our platform 🖤
      </p>
    </section>
  );
};

export default Profile;
