import config from './config'

const JobAPI = {
  search: (payload) =>
    config.get('/jobs', {
      params: { ...payload },
    }),
  create: (payload) => config.post('/jobs', payload),
  delete: (id) => config.delete(`/jobs/${id}`),
  update: (id, payload) => config.put(`/jobs/${id}`, payload),
  findById: (id) => config.get(`/jobs/${id}`),
}

export default JobAPI
