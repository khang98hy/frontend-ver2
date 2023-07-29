import config from './config'

const MessageAPI = {
  getAll: (payload) =>
    config.get('/messages', {
      params: { ...payload },
    }),
  create: (payload) => config.post('/messages', payload),
  readAll: (applicationJobId, userId) =>
    config.put(`/messages/read-all/${applicationJobId}/${userId}`),
  count: (applicationJobId) => config.get(`/messages/count/${applicationJobId}`),
}

export default MessageAPI
