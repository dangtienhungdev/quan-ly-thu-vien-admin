import axios from 'axios';

// Tạo instance axios với cấu hình cơ bản
export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor để thêm token
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('access_token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor để xử lý lỗi
apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response?.status === 401) {
			// Token hết hạn, redirect về login
			localStorage.removeItem('access_token');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);
