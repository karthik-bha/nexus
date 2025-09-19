import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(e);
        setUsername(e.target[0].value);
        setPassword(e.target[1].value);
        setEmail(e.target[2].value);
        console.log(username, password, email);
        const resp = await fetch("http://localhost:3000/sign-up", {
            body: JSON.stringify({ username, password, email }),
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        console.log(resp.body);
    }


    return (
        <div className="h-[100vh] items-center justify-center flex flex-col">
            <h1 className="absolute top-32 text-4xl text-center font-bold tracking-widest"> <Link to="/">NEXUS</Link> </h1>
            <form
                className="flex flex-col gap-4 p-4"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-semibold">Sign Up</h2>
                <input
                    id="username"
                    className="border p-1 rounded-lg"
                    type="text" placeholder="username *" />

                <input
                    id="password"
                    className="border p-1 rounded-lg"
                    type="password" placeholder="password *" />

                <input
                    id="email"
                    className="border p-1 rounded-lg"
                    type="email" placeholder="email" />

                <button className="border p-1 rounded-lg" type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default Signup