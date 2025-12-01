import axios from 'axios';

const api = axios.create({
	baseURL: 'https://senai-id-1.onrender.com/api/',
	withCredentials: true, // 🔥 Permite envio de cookies e credenciais
	headers: {
		'Accept': 'application/json',
	}
});

// 🔥 Função para aplicar o token ao Axios globalmente
export const setAuthToken = (token) => {
	if (token) {
		api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	} else {
		delete api.defaults.headers.common['Authorization'];
	}
};

// 🔥 Interceptor opcional para sempre garantir o Authorization
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token'); // Caso recarregue a página
		if (token) config.headers['Authorization'] = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

// 🔥 Tratamento de erro padronizado (opcional)
api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("API Error:", error.response?.data || error.message);
		return Promise.reject(error);
	}
);

export default api;
