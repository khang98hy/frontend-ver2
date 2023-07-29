import config from './config'

const UserAPI = {
  getCurrentUserInfo: () => config.get('/account'),
  initResetPassword: (payload) => config.post('/account/reset-password/init', payload),
  finishResetPassword: (payload) => config.post('/account/reset-password/finish', payload),
  changePassword: (payload) => config.post('/account/change-password', payload),
  registerJobSeeker: (payload) => config.post('/register/job-seeker', payload),
  registerEmployer: (payload) => config.post('/register/employer', payload),
  activateAccount: (payload) =>
    config.get('/activate', {
      params: payload,
    }),

  searchUser: (payload) => config.get('/admin/users', { params: { ...payload } }),
  updateStatus: (id, status) => config.patch(`/admin/users/${id}/${status}`),
}

export default UserAPI
