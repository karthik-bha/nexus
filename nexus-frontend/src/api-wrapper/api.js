const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const apiWrapper = async (endpoint, options = {}) => {

    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    if (!(options.body instanceof FormData)) {
        options.headers["Content-Type"] = "application/json";
    }

    try {
        let response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        return response;
    }
    catch (err) {
        console.error("API error:", err);
        throw err;
    }

}
export default apiWrapper;