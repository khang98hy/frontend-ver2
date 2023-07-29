import config from './config'

const ApplicationJobAPI = {
  search: (payload) =>
    config.get('/application-jobs', {
      params: { ...payload },
    }),
  create: (payload) => config.post('/application-jobs', payload),
  delete: (id) => config.delete(`/application-jobs/${id}`),
  update: (id, payload) => config.put(`/application-jobs/${id}`, payload),
  accept: (id, payload) => config.put(`/application-jobs/${id}/accept`, payload),
  reject: (id) => config.put(`/application-jobs/${id}/reject`),
}

export default ApplicationJobAPI
