
'use client';

import { toast } from "react-toastify";
import apiWrapper from "../api-wrapper/api";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useState } from "react";

const PassReset = () => {
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log(e.target.password.value);
        try {
            const response = await apiWrapper("/user/reset-password", {
                method: "PATCH",
                body: JSON.stringify({ newPassword: e.target.password.value })
            })
            if (response.status == 200) {
                toast.success("Password reset successful:");
            }
            else {
                toast.error("Password reset failed:");
            }

        } catch (e) {
            toast.error("Password reset failed:", data);
        } finally {
            setLoading(false);
        }
    }
    if (loading) return <Loader />
    return (
        <section>
            <h2 className="text-center py-12 text-3xl md:text-4xl">Reset your password here</h2>
            <form className="items-center flex flex-col gap-4 pt-12" onSubmit={handleSubmit}>
                <div className="flex md:flex-row flex-col items-center gap-2">
                    <label htmlFor="password">New Password</label>
                    <input id="password" name="password" type="password" className="border px-2 py-1 rounded-sm" />
                </div>
                <button className="button_style_1" type="submit">Change your password</button>
                <Link to="/profile">Go back to home</Link>
            </form>
        </section>
    )
}

export default PassReset