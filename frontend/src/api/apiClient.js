import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: attach access token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried, try refreshing token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const { data } = await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                        { refreshToken }
                    );

                    // Save new tokens
                    localStorage.setItem('accessToken', data.data.accessToken);
                    localStorage.setItem('refreshToken', data.data.refreshToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    const refreshStatus = refreshError.response?.status;

                    // Only force logout when refresh token is invalid/expired (auth errors)
                    if (refreshStatus === 401 || refreshStatus === 403) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/login';
                    }

                    // For network/server errors, keep the user logged in and surface the error
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token, do not hard logout; just reject so caller can handle
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
