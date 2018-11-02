import getUserId from '../utils/getUserId'

const User = {
  email(parent, args, { request }, info) {
    const userId = getUserId(request, false)

    // Return an email only for the logged in user.
    // Note the query must return/select user id
    // otherwise all emails will be hidden.
    if (userId && userId === parent.id) {
      return parent.email
    }
    else {
      return null
    }
  }
}

export { User as default }
