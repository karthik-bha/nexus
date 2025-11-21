import { useState } from "react";
import { useForm } from "react-hook-form";
import { Trash, Loader2 } from "lucide-react";
import apiWrapper from "../api-wrapper/api";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/", "video/"];

const Post = () => {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm();

  const [filePreview, setFilePreview] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUploadError("");

    if (!file) {
      setFilePreview(null);
      return;
    }

    if (!ALLOWED_TYPES.some((type) => file.type.startsWith(type))) {
      setUploadError("Only image and video files are allowed.");
      event.target.value = "";
      setFilePreview(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("File size must be under 1MB.");
      event.target.value = "";
      setFilePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setFilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setFilePreview(null);
    resetField("postFile");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setNotification(null);

    const formData = new FormData();
    formData.append("file", data.postFile[0]);
    formData.append("description", data.description);

    try {
      const response = await apiWrapper("/post/", {
        method: "POST",
        body: formData,
      });

      setNotification({
        type: "success",
        message: "Post published successfully!",
      });

      resetField("description");
      resetField("postFile");
      setFilePreview(null);
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <section className="flex flex-col items-center text-gray-100 bg-black min-h-screen py-10">
      <h2 className="text-3xl text-center font-semibold tracking-wide mb-12 ">
        Create a New Post
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 px-6 py-8 border border-gray-800 rounded-3xl w-full max-w-lg shadow-xl bg-[#1a1a1a]"
      >
        {/* Media Input Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="postFile" className="text-lg font-semibold">
            Upload Image
          </label>
          <input
            id="postFile"
            type="file"
            accept="image/*,video/*"
            {...register("postFile", { required: true })}
            onChange={handleFileChange}
            disabled={loading}
            className="block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0 file:font-semibold
              file:bg-gray-700 file:text-gray-100 hover:file:bg-gray-600
              cursor-pointer disabled:opacity-60"
          />
          {errors.postFile && (
            <p className="text-red-500 text-sm">Media file is required.</p>
          )}
          {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
        </div>

        {/* File Preview */}
        {filePreview && (
          <div className="mt-4 relative">
            <div className="border-2 border-dashed border-gray-600 p-2 rounded-xl flex items-center justify-center bg-[#111]">
              {filePreview.startsWith("data:video") ? (
                <video src={filePreview} controls className="max-h-64 rounded-lg" />
              ) : (
                <img src={filePreview} alt="Preview" className="max-h-64 rounded-lg" />
              )}
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={loading}
              className="absolute top-0 right-0 m-2 p-1 bg-gray-800 rounded-full text-gray-300 hover:text-white focus:ring-2 focus:ring-gray-500 transition-colors"
              aria-label="Remove media"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Description Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-lg font-semibold">
            Description
          </label>
          <textarea
            id="description"
            placeholder="What's on your mind? (200 characters max)"
            className="w-full border border-gray-700 rounded-lg p-3 min-h-[120px] resize-none
              focus:outline-none focus:ring-2 focus:ring-gray-500 bg-[#111] text-gray-200 placeholder-gray-500"
            {...register("description", {
              required: true,
              maxLength: 200,
            })}
            disabled={loading}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">
              Description is required and must be under 200 characters.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-100 text-black py-2 rounded-full font-semibold hover:bg-gray-300 disabled:opacity-70 transition-colors flex justify-center items-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Publishing...
            </>
          ) : (
            "Post"
          )}
        </button>

        {/* Notification */}
        {notification && (
          <div
            className={`text-center p-3 rounded-lg mt-4 ${
              notification.type === "success"
                ? "bg-green-700 text-green-100"
                : "bg-red-700 text-red-100"
            }`}
          >
            {notification.message}
          </div>
        )}
      </form>
    </section>
  );
};

export default Post;
