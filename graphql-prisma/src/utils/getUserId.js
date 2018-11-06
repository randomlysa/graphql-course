import jwt from 'jsonwebtoken'

const getUserId = (request, requireAuth = true) => {
  // http headers (top) or websocket headers (bottom)
  const header = request.request ?
    request.request.headers.authorization :
    request.connection.context.Authorization

  if(header) {
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded.userId
  }

  // If auth is not required, don't throw an error.
  if (requireAuth) throw new Error('Authentication required')
  return null
}

export { getUserId as default }
