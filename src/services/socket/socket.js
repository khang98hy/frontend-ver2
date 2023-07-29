import io from 'socket.io-client'
// const sockets = io('http://localhost:3001', { autoConnect: true, forceNew: true });
const sockets = io('http://103.188.245.44:3001')
export default sockets
