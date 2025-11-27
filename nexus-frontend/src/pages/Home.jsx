import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate(); 

    return (
        <div className="h-[100vh] flex items-center justify-center bg-black text-gray-100">
            <div className="text-center z-50 px-4">
                <img src="/nexus-logo.jpg" alt="Nexus Logo" className="w-full md:w-[550px] h-auto mx-auto mb-6" />
                <h2 className="text-gray-300 mb-6">The Nexus for all the happening</h2>
                <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
                    <button
                        className="hover:cursor-pointer bg-gray-100 text-black font-semibold py-2 px-6 rounded-full hover:bg-gray-300 transition-all duration-200"
                        onClick={() => navigate("/auth?type=sign-up")} 
                    >
                        Sign Up
                    </button>
                    <button
                        className="hover:cursor-pointer bg-transparent border border-gray-400 text-gray-200 font-semibold py-2 px-6 rounded-full hover:bg-gray-800 hover:border-gray-200 transition-all duration-200"
                        onClick={() => navigate("/auth?type=sign-in")}
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;