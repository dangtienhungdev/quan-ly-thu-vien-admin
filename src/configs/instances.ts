import axios from 'axios';

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
	// timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor
instance.interceptors.request.use(
	(config) => {
		// Thêm token vào header nếu cần
		const token = localStorage.getItem('accessToken');
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(new Error(error?.message || 'Request error'))
);

// Response interceptor
instance.interceptors.response.use(
	(response) => response,
	(error) => {
		// Xử lý lỗi toàn cục (ví dụ: thông báo, redirect, ...)
		if (error.response && error.response.status === 401) {
			// Ví dụ: logout hoặc chuyển hướng
			localStorage.removeItem('accessToken');
			window.location.href = '/login';
		}
		return Promise.reject(new Error(error?.message || 'Response error'));
	}
);

export default instance;
