import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
  return jwt.sign({
    userId
  }, 'jwt_secret_token', {
    expiresIn: '30 days'
  })
}

export { generateToken as default }
