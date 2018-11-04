import '@babel/polyfill/noConflict'
import server from './server'

server.start(() => {
  console.log('server is up');
})
