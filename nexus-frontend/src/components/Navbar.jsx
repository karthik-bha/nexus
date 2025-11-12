import { ImagePlus, LogOut, Settings, UserRound, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [dropDown, setDropDown] = useState(false);
    const dropRef = useRef(null);

    const handleToggleDropDown = () => setDropDown((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropRef.current && !dropRef.current.contains(event.target)) {
                const accountIcon = document.getElementById("account-icon");
                if (accountIcon && !accountIcon.contains(event.target)) setDropDown(false);
            }
        };

        if (dropDown) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropDown]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.replace("/auth?type=signin");
    };

    return (
        <div className="bg-black text-white sticky top-0 z-50 shadow-lg border-b border-gray-800">
            <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <h1 className="text-2xl md:text-3xl font-semibold tracking-widest text-white hover:text-gray-300 transition-colors">
                    <Link to="/dashboard">
                        NEXUS
                    </Link>
                </h1>


                {/* Icons */}
                <div className="flex gap-6 items-center relative">
                    <Link to="/chat" title="Messages">
                        <MessageSquare
                            size={24}
                            className="hover:text-gray-300 transition-transform hover:scale-110"
                        />
                    </Link>

                    <img
                        id="account-icon"
                        src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png "
                        className="w-9 h-9 hover:cursor-pointer hover:scale-110 transition-all border border-gray-700 rounded-full"
                        onClick={handleToggleDropDown}
                        alt="Account"
                    />

                    {/* Dropdown */}
                    {dropDown && (
                        <div
                            ref={dropRef}
                            className="absolute top-12 right-0 bg-gray-900 text-white border border-gray-700 rounded-2xl shadow-xl w-[85vw] md:w-[25vw] xl:w-[15vw] p-4 animate-fadeIn"
                        >
                            <ul className="flex flex-col gap-3 text-sm">
                                <li>
                                    <Link
                                        to="/post"
                                        className="flex gap-2 items-center hover:text-gray-300 transition-all"
                                        onClick={() => setDropDown(false)}
                                    >
                                        <ImagePlus size={18} />
                                        <span>New Post</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/profile"
                                        className="flex gap-2 items-center hover:text-gray-300 transition-all"
                                        onClick={() => setDropDown(false)}
                                    >
                                        <UserRound size={18} />
                                        <span>Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/settings"
                                        className="flex gap-2 items-center hover:text-gray-300 transition-all"
                                        onClick={() => setDropDown(false)}
                                    >
                                        <Settings size={18} />
                                        <span>Settings</span>
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="flex gap-2 items-center hover:text-red-400 transition-all"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
