const isValidPassword = (password) => {
  return password.length >= 8 && !password.toLowerCase().includes('password')
}

export { isValidPassword }
