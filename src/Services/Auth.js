import axios from "axios";

// must have => to sanctum laravel
axios.defaults.withCredentials = true;

// add header to request 
axios.interceptors.request.use(
  (config) => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class Auth {
  // api login
  async login(data) {
    return await axios.post("http://localhost:8000/api/login", data);
  }
  // api logout
  async logout() {
    return await axios.post("http://localhost:8000/api/logout", null);
  }
}
export default new Auth();
