const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const apiWrapper = async (endpoint, options = {}) => {
    options.headers = {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    try {
        let response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        // if (response.status === 401) {
        //     localStorage.clear();
        //     window.location.href = "/auth?type=signin";
        //     return;
        // }

        // Return parsed response
        return response;
    }
    catch (err) {
        console.log(err);
    }

}
export default apiWrapper;