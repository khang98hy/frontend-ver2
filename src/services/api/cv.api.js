import config from './config'

const CvAPI = {
  search: (payload) =>
    config.get('/cvs', {
      params: { ...payload },
    }),
  create: (payload) => config.post('/cvs', payload),
  delete: (id) => config.delete(`/cvs/${id}`),
  update: (id, payload) => config.put(`/cvs/${id}`, payload),
}

export default CvAPI
