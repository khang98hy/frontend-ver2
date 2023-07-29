import config from './config'

const JobCategoryAPI = {
  search: (payload) =>
    config.get('/job-categories', {
      params: payload,
    }),
  create: (payload) => config.post('/job-categories', payload),
  update: (id, payload) => config.put(`/job-categories/${id}`, payload),
  delete: (id) => config.delete(`/job-categories/${id}`),
}

export default JobCategoryAPI
