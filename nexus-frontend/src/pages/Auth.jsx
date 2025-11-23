import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiWrapper from "../api-wrapper/api";

const Auth = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");

    function decodeJwt(token) {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!username || !password) {
                toast.error("Username and password are required.");
                setLoading(false);
                return;
            }
            if (username.trim().length < 3) {
                return toast.error("Username must be at least 3 characters.");
            }

            if (password.length < 4) {
                return toast.error("Password must be at least 4 characters.");
            }

            if (type === "sign-up" && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return toast.error("Invalid email format.");
            }


            const body = { username, password };
            if (type === "sign-up" && email.trim() !== "") body.email = email;

            const endpoint =
                type === "sign-up"
                    ? `${import.meta.env.VITE_BACKEND_URL}/user/sign-up`
                    : `${import.meta.env.VITE_BACKEND_URL}/user/sign-in`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                if (type === "sign-up") {
                    toast.success("Sign-up successful! Redirecting to Sign In...");
                    setTimeout(() => {
                        window.location.href = "/auth?type=sign-in";
                    }, 2000);
                } else {
                    const token = await response.text();
                    localStorage.setItem("token", token);
                    const decoded = decodeJwt(token);
                    localStorage.setItem("userId", decoded.sub);

                    const data = await apiWrapper('/user/profile', { method: 'GET' });
                    const user = await data.json();
                    localStorage.setItem('pfp', user.profile_picture || "");
                    toast.success("Sign-in successful! Redirecting...");
                    window.location.href = "/dashboard";
                }
            }

            else if (response.status === 409) {
                toast.error("Username already exists.");
            } else {
                const errorText = await response.text();
                toast.error(errorText || "Something went wrong. Try again.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-[url('/bg-c.jpg')] bg-cover bg-center text-gray-100 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md">
                {/* <h1 className="text-5xl md:text-6xl font-semibold tracking-widest text-white text-center mb-10">
                    <Link to="/">NEXUS</Link>
                </h1> */}
                <Link to="/"><img src="/nexus-logo-transparent.png" alt="Nexus Logo" className="w-full md:w-[400px] h-auto mx-auto mb-6" /></Link>

                <form
                    onSubmit={handleSubmit}
                    className="backdrop-blur-lg bg-white/5 border border-white/10 p-8 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.5)] flex flex-col gap-4"
                >

                    <h2 className="text-2xl font-semibold text-center mb-4">
                        {type === "sign-up" ? "Sign Up" : "Sign In"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Username *"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-white/5 text-gray-200 p-3 rounded-lg border border-white/10 focus:ring-2 focus:ring-[#6EE7FF] outline-none placeholder-gray-400 transition"
                    />

                    <input
                        type="password"
                        placeholder="Password *"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/5 text-gray-200 p-3 rounded-lg border border-white/10 focus:ring-2 focus:ring-[#6EE7FF] outline-none placeholder-gray-400 transition"
                    />

                    {type === "sign-up" && (
                        <input
                            type="email"
                            placeholder="Email (optional)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/5 text-gray-200 p-3 rounded-lg border border-white/10 focus:ring-2 focus:ring-[#6EE7FF] outline-none placeholder-gray-400 transition"
                        />
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gray-100 text-black font-semibold py-3 rounded-full hover:bg-gray-300 transition disabled:opacity-50"
                    >
                        {loading ? "Please wait..." : type === "sign-up" ? "Sign Up" : "Sign In"}
                    </button>

                    <p className="text-center text-gray-400 mt-2">
                        {type === "sign-up" ? "Already have an account?" : "Don't have an account?"}{" "}
                        <Link
                            className="text-red-400 hover:text-red-500 transition"
                            to={`/auth?type=${type === "sign-up" ? "sign-in" : "sign-up"}`}
                        >
                            {type === "sign-up" ? "Sign In" : "Sign Up"}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Auth;
