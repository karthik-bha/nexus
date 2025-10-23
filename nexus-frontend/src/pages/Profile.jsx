import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

// a small message thanking them for using the platform
const Profile = () => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);
    const [Error, setError] = useState(null);
    const [profileData, setProfileData] = useState({});
    const [editProfile, setEditProfile] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, [])

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/profile`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            if (response.status === 200) {
                const data = await response.json();
                // console.log(data);
                setProfileData(data);
            }
            else if (response.status === 401) {
                console.log(token);
                // localStorage.removeItem("token");
                // window.location.replace("/");
            }

        } catch (e) {
            console.log(e);
            setError("Error while fetching your details. please try again later");
        } finally {
            setLoading(false);
        }
    }
    const extraData = {
        profile_picture: "data:image/png;base64,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",
    }
    const date = new Date(profileData?.created_at);
    const userFriendlyDate = date.toString();

    if (Error) {
        return (<div>{Error}</div>)
    }
    if (editProfile) {
        return <EditProfileForm profileData={profileData} setEditProfile={setEditProfile} setProfileData={setProfileData} loading={loading} setLoading={setLoading} token={token} />
    }

    if (loading) return <Loader />

    return (
        <section className="max-w-[1200px] mx-auto flex flex-col py-12 px-4">
            <h2 className="text-2xl md:text-3xl text-center font-semibold ">Profile</h2>
            <div className="flex flex-col items-center py-6 gap-4 md:w-[40vw]  md:mx-auto">
                <img src={profileData.profile_picture || extraData.profile_picture}
                    alt="profile_picture"
                    className="h-32 w-32"
                />
                <div className="flex flex-col gap-4">
                    <p>{profileData?.username || "Username not available"}</p>
                    {profileData?.email ? <>
                        <p>{profileData.email}</p>
                    </> : <>
                        <p className="text-red-500 text-[0.9rem] italic">No e-mail found</p>
                    </>}
                    <p className={profileData?.bio ? "" : `text-red-500 text-[0.9rem] italic`}>{profileData?.bio || "No bio found"}</p>
                    <div className="flex gap-2 flex-col md:flex-row">
                        <button className="button_style_2 text-[0.9rem]" onClick={() => window.location.href = "/reset-password"}>Reset password</button>
                        <button className="button_style_2 text-[0.9rem]"
                            onClick={() => setEditProfile(true)}>Edit profile</button>
                    </div>
                    <p className="text-[0.9rem] text-gray-400">Joined on {userFriendlyDate}</p>
                </div>
            </div>
        </section>
    )
}

export default Profile
const EditProfileForm = ({ profileData, setEditProfile, setLoading, setProfileData, token, loading }) => {
    // Initialize state using data passed via props
    const [username, setUsername] = useState(profileData.username || "");
    const [email, setEmail] = useState(profileData.email || "");
    const [bio, setBio] = useState(profileData.bio || "");
    const form = new FormData();


    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/profile`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, email, bio })
                });
            console.log(response);
            switch (response.status) {
                case 200: {
                    toast.success("Profile updated successfully");
                    const data = await response.json();
                    // console.log(data);
                    setProfileData(data);
                    break;
                }
                default: {
                    toast.error("Failed to update profile");
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };
    if (loading) return <Loader />
    return (
        // Modal overlay for the form
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Background dimmer - clicking it closes the modal */}
            <div
                className="absolute inset-0 bg-black opacity-60"
                onClick={() => setEditProfile(false)}
            ></div>

            <form
                className="z-50 bg-white p-6 rounded-xl shadow-2xl flex flex-col gap-4 w-full max-w-md transform transition-all"
                onSubmit={handleSave}
            >
                <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-2">Edit Your Profile</h3>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
                <textarea
                    placeholder="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="border p-3 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 transition"
                    maxLength={200}
                />

                <div className="flex gap-3 justify-end mt-2">
                    <button
                        type="button"
                        onClick={() => setEditProfile(false)}
                        className="button_style_1 "
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="button_style_1 "
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};