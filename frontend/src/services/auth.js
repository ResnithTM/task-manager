import api from './api'

export function login(email, password) {
  return api.post('/login', { email, password })
}

export function register(name, email, password, password_confirmation) {
  return api.post('/register', { name, email, password, password_confirmation })
}

export function logout() {
  return api.post('/logout')
}

export function getMe() {
  return api.get('/me')
}
