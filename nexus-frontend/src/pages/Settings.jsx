import { useState } from "react";
import { toast } from "react-toastify";
import apiWrapper from "../api-wrapper/api";

const Settings = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetting, setResetting] = useState(false);

    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

    // Update profile details
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const form = new FormData();
            const user = { username, email, bio };
            form.append("user", new Blob([JSON.stringify(user)], { type: "application/json" }));
            if (file) form.append("file", file);

            await apiWrapper(`/user/profile`, {
                method: "PATCH",
                body: form,
            });

            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error(err);

            // Check if error message contains status code
            if (err.message.includes("409")) {
                toast.error("Username already taken.");
            } else {
                toast.error("Unexpected error. Try again later.");
            }
        } finally {
            setSaving(false);
        }
    };


    // Change password
    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error("Please fill in both fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (newPassword.length < 1) {
            toast.error("Password must be at least 1 character long.");
            return;
        }

        setResetting(true);

        try {
            const response = await apiWrapper("/user/reset-password", {
                method: "PATCH",
                body: JSON.stringify({ newPassword }),
            });

            if (response.ok) {
                toast.success("Password updated successfully!");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error("Failed to update password.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error. Try again later.");
        } finally {
            setResetting(false);
        }
    };

    return (
        <section className="max-w-[700px] mx-auto py-12 px-6 text-gray-100">
            <h2 className="text-3xl text-center font-semibold mb-8">Account Settings</h2>

            {/* Profile Update */}
            <form
                onSubmit={handleProfileUpdate}
                className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-lg flex flex-col gap-4 mb-10"
            >
                <h3 className="text-xl font-semibold mb-3">Edit Profile</h3>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const selected = e.target.files[0];
                        if (selected && selected.size > MAX_FILE_SIZE) {
                            toast.error("File too large (max 1MB).");
                            e.target.value = "";
                            return;
                        }
                        setFile(selected);
                    }}
                    className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-3 file:rounded-full
            file:border-0 file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
                />

                <input
                    type="text"
                    placeholder="Username"
                    className="bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-gray-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-gray-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <textarea
                    placeholder="Bio (max 200 chars)"
                    className="bg-neutral-800 border border-neutral-700 p-3 rounded-lg h-24 resize-none focus:ring-2 focus:ring-gray-500"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={200}
                />

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-gray-100 text-black font-semibold py-2 rounded-full hover:bg-gray-300 disabled:opacity-60 transition"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>

            {/* Change Password */}
            <form
                onSubmit={handlePasswordReset}
                className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-lg flex flex-col gap-4"
            >
                <h3 className="text-xl font-semibold mb-2">Change Password</h3>
                <p className="text-sm text-gray-400 mb-1">
                    Enter your new password below.
                </p>

                <input
                    type="password"
                    placeholder="New Password"
                    className="bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-gray-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="bg-neutral-800 border border-neutral-700 p-3 rounded-lg focus:ring-2 focus:ring-gray-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={resetting}
                    className="bg-gray-100 text-black font-semibold py-2 rounded-full hover:bg-gray-300 disabled:opacity-60 transition"
                >
                    {resetting ? "Updating..." : "Update Password"}
                </button>
            </form>
        </section>
    );
};

export default Settings;
