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
  // Hide unpublished posts.
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma }, info) {
      return prisma.query.posts({
        where: {
          author: {
            id: parent.id
          },
          published: true
        }
      }, info)
    } // resolve
  } // posts
} // const User

export { User as default }
