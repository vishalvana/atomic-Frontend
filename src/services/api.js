import axios from 'axios'

const BASE_URL = 'https://atomicflow-production-0974.up.railway.app'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  me: () => api.get('/auth/me'),
}

export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
}

export const projectsAPI = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  getById: (id) => api.get(`/projects/${id}`),
}

export const tasksAPI = {
  create: (data) => api.post('/tasks', data),
  getByUser: (userId) => api.get(`/tasks/user/${userId}`),
  getByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
  updateStatus: (taskId, status) => api.put(`/tasks/${taskId}/status?status=${status}`),
}

export const dashboardAPI = {
  get: () => api.get('/dashboard'),
}

export default api
