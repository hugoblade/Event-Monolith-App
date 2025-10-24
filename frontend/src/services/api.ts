import axios from 'axios';

// Replace with your Render/Dev URL
const BASE_URL = process.env.API_BASE_URL || 'http://10.0.2.2:4000'; // 10.0.2.2 for Android emulator local

class ApiService {
  instance;

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 15000,
    });

    this.instance.interceptors.response.use(
      res => res,
      err => {
        // centralized error handling can go here
        return Promise.reject(err);
      }
    );
  }

  setToken(token: string | null) {
    if (token) {
      this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.instance.defaults.headers.common['Authorization'];
    }
  }

  get(path: string, config = {}) {
    return this.instance.get(path, config);
  }
  post(path: string, data: any, config = {}) {
    return this.instance.post(path, data, config);
  }
  put(path: string, data: any, config = {}) {
    return this.instance.put(path, data, config);
  }
  delete(path: string, config = {}) {
    return this.instance.delete(path, config);
  }
}

export default new ApiService();