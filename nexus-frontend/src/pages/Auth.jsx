import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

const Auth = () => {
    // 1. Define state variables for each input
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const type = searchParams.get("type");

    const handleSubmit = async (e) => {
        e.preventDefault();

        let resp;

        try {
            if (type === "sign-up") {
                console.log(username, password, email);
                resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/sign-up`, {
                    body: JSON.stringify({ username, password, email }),
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/sign-in`, {
                    body: JSON.stringify({ username, password }),
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(resp);
                const token = await resp.text();
                localStorage.setItem("token", token);
                window.location.replace("/dashboard");
            }


        } catch (err) {
            console.log("Error during submission:", err);
        }
        // finally {
        //     window.location.href = "/dashboard";
        // }
    };

    return (
        <div className="h-[100vh] items-center justify-center flex flex-col">
            <h1 className="absolute top-32 text-5xl text-center font-bold tracking-widest"> <Link to="/">NEXUS</Link> </h1>
            <form
                className="flex flex-col gap-4 p-4"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-semibold">{type === "sign-up" ? "Sign Up" : "Sign In"}</h2>

                {/* 2. Make inputs controlled components */}
                <input
                    id="username"
                    className="border p-1 rounded-lg"
                    type="text"
                    placeholder="username *"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    id="password"
                    className="border p-1 rounded-lg"
                    type="password"
                    placeholder="password *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {type === "sign-up" && (
                    <input
                        id="email"
                        className="border p-1 rounded-lg"
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                )}

                <button className="button_style_1" type="submit">
                    {type === "sign-up" ? "Sign Up" : "Sign In"}
                </button>
                <p className="flex gap-2">{type === "sign-up" ? "Already have an account?" : "Don't have an account?"}
                    <Link className="hover:text-red-500 transition duration-200 " to={`/auth?type=${type === "sign-up" ? "signin" : "sign-up"}`}>
                        {type === "sign-up" ? "Sign In" : "Sign Up"}</Link></p>
            </form>
        </div>
    );
};

export default Auth;