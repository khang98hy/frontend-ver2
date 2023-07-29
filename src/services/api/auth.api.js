import config from './config'

const AuthAPI = {
  login: (payload) => config.post(`/authenticate`, payload),
  register: (payload) => config.post(`/auth/local/register`, payload),
  forgotPassword: (payload) => config.post(`/auth/forgot-password`, payload),
  resetPassword: (payload) => config.post(`/auth/reset-password`, payload),
  changePassword: (payload)=> config.post(`/auth/change-password`, payload)
}

export default AuthAPI
