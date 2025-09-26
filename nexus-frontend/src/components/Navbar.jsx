import { ImagePlus, Settings, UserRound, Video } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [dropDown, setDropDown] = useState(false);
    const dropRef = useRef(null);

    const handleToggleDropDown = () => {
        setDropDown(prev => !prev);
    };

    // This effect handles closing the dropdown on clicks outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropRef.current && !dropRef.current.contains(event.target)) {
                const accountIcon = document.getElementById('account-icon');
                if (accountIcon && !accountIcon.contains(event.target)) {
                    setDropDown(false);
                }
            }
        };

        if (dropDown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropDown]);

    const handleLinkClick = () => {
        setDropDown(false);
    };

    return (
        <div>
            <div className="max-w-[1200px] mx-auto md:border-b-4 
            border-b-2 md:border-r md:border-l md:rounded-b-3xl p-6 flex justify-between 
            items-center">
                <h1 className="text-2xl md:text-3xl font-bold tracking-widest"><Link to="/dashboard">NEXUS</Link></h1>
                <div className="flex gap-6 items-center relative">
                    <Link to="/chat">
                        <img
                            src="/src/assets/chat.svg"
                            className="w-7 h-7 md:w-8 md:h-8 hover:cursor-pointer hover:scale-110 transition-all 2s "
                        />
                    </Link>
                    <img
                        id="account-icon"
                        src="/src/assets/account.svg"
                        className="w-8 h-8 md:w-9 md:h-9 hover:cursor-pointer hover:scale-110 transition-all 2s"
                        onClick={handleToggleDropDown}
                    />
                    {dropDown &&
                        <div
                            className="absolute bg-white top-12 right-0 p-4 border-2 rounded-2xl w-[85vw] md:w-[25vw] xl:w-[15vw]"
                            ref={dropRef}
                        >
                            <ul className="flex flex-col gap-4">
                                <li>
                                    <Link
                                        to="/post"
                                        className="flex gap-2 items-center hover:font-semibold transition-all duration-200"
                                        onClick={handleLinkClick}
                                    >
                                        <ImagePlus />
                                        <span>New Post</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/profile"
                                        className="flex gap-2 items-center hover:font-semibold transition-all duration-200"
                                        onClick={handleLinkClick}
                                    >
                                        <UserRound />
                                        <span>Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/settings"
                                        className="flex gap-2 items-center hover:font-semibold transition-all duration-200"
                                        onClick={handleLinkClick}
                                    >
                                        <Settings />
                                        <span>Settings</span>
                                    </Link>
                                </li>
                                
                            </ul>
                        </div>
                    }
                </div>
            </div>
        </div >
    );
};

export default Navbar;