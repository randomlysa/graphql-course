import bcrypt from 'bcryptjs'

const hashPassword = (password) => {
  // Check if password is 8 characters or longer.
  if(password.length < 8) {
    throw new Error('Password must be 8 characters or more.')
  }

  // Hash and return the password.
  return bcrypt.hash(password, 10)
}

export { hashPassword as default }
