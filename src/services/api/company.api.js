import config from './config'

const CompanyAPI = {
  search: (payload) =>
    config.get('/companies', {
      params: { ...payload },
    }),

  delete: (id) => config.delete(`/companies/${id}`),
  update: (id, payload) => config.put(`/companies/${id}`, payload),
  getCurrentCompany: () => config.get('/companies/current-company'),
  findById: (id) => config.get(`/companies/${id}`),
}

export default CompanyAPI
