import getUserId from '../utils/getUserId'

const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false)

      // Return an email only for the logged in user.
      if (userId && userId === parent.id) {
        return parent.email
      }
      else {
        return null
      }
    }
  }
}

export { User as default }
