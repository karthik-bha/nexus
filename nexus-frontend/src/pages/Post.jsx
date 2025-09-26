import { Cross, CrossIcon, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Post = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [filePreview, setFilePreview] = useState(null);

    // Handle file selection and create a preview
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const handleRemoveFile = () => {
        setFilePreview(null);
        resetField("postFile");
    };

    // Handle form submission
    const onSubmit = async (data) => {
        console.log(data);
        const formData = new FormData();
        formData.append('file', data.postFile[0]);
        formData.append('description', data.description);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post/`, {
                method: "POST",
                body: formData
            })
            console.log(response);
        } catch (err) {
            console.log(err);
        }

    };

    return (
        <section className="flex flex-col items-center">
            <h2 className="text-center text-3xl md:text-4xl mt-12 mb-8 font-bold ">
                Create a New Post
            </h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 px-6 py-8 border  rounded-3xl w-full max-w-lg shadow-lg bg-white"
            >
                {/* Media Input Field */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="postFile" className="text-lg font-semibold ">
                        Upload Image or Video
                    </label>
                    <input
                        id="postFile"
                        type="file"
                        accept="image/*,video/*"
                        {...register("postFile", { required: true })}
                        onChange={handleFileChange}
                        className="block w-full text-sm  file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    {errors.postFile && (
                        <p className="text-red-600 text-sm">Media file is required.</p>
                    )}
                </div>

                {/* File Preview */}
                {filePreview && (
                    <div className="mt-4 relative">
                        <div className="border-2 border-dashed border-gray-400 p-2 rounded-xl flex items-center justify-center">
                            {filePreview.startsWith("data:video") ? (
                                <video src={filePreview} controls className="max-h-64 rounded-lg" />
                            ) : (
                                <img src={filePreview} alt="Preview" className="max-h-64 rounded-lg" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="absolute top-0 right-0 m-2 p-1 bg-white rounded-full shadow-md text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-200"
                            aria-label="Remove media"
                        >
                            <Trash className="h-6 w-6 hover:cursor-pointer" />
                        </button>
                    </div>
                )}


                {/* Description Field */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-lg font-semibold ">
                        Description
                    </label>
                    <textarea
                        id="description"
                        className="w-full border border-gray-300 rounded-lg p-3 min-h-[150px] resize-none focus:outline-none focus:ring-2 focus:black"
                        placeholder="What's on your mind? (200 characters max)"
                        {...register("description", { required: true, maxLength: 200 })}
                    />
                    {errors.description && (
                        <p className="text-red-600 text-sm">
                            Description is required and must be under 200 characters.
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="button_style_1"
                >
                    Post
                </button>
            </form>
        </section>
    );
};

export default Post;