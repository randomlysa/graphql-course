import jwt from 'jsonwebtoken'

const getUserId = (request, requireAuth = true) => {
  const header = request.request.headers.authorization

  if(header) {
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, 'jwt_secret_token')
    return decoded.userId
  }

  // If auth is not required, don't throw an error.
  if (requireAuth) throw new Error('Authentication required')

  return null

}

export { getUserId as default }
