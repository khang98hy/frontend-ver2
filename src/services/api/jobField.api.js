import config from './config'

const JobFieldAPI = {
  search: (payload) =>
    config.get('/job-fields', {
      params: payload,
    }),
  create: (payload) => config.post('/job-fields', payload),
  update: (id, payload) => config.put(`/job-fields/${id}`, payload),
  delete: (id) => config.delete(`/job-fields/${id}`),
}

export default JobFieldAPI
