import axios from "axios";

// Create Centralized Axios Instance
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true, // Crucial for sending httpOnly cookies seamlessly
});

// A mechanism to notify the React components to log out when refresh completely fails.
// Since interceptors run outside React Context, we dispatch a custom event.
export const triggerGlobalLogout = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("axios-auth-logout"));
  }
};

// Request Interceptor
// We don't need to manually inject tokens into the Authorization header
// because Next.js handles them via HTTP-only cookies securely!
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already retried this exact request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loops if the refresh endpoint itself throws 401!
      if (originalRequest.url === "/auth/refresh") {
        triggerGlobalLogout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });

        // If successful, the browser will automatically update
        // the `access_token` http-only cookie from the response.
        // We can just seamlessly retry the exact failed request!
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh token is also invalid or expired, log them out
        triggerGlobalLogout();
        return Promise.reject(refreshError);
      }
    }

    // Default error rejection
    return Promise.reject(error);
  },
);

export default api;
