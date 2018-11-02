import getUserId from '../utils/getUserId'

const User = {
  // Hide all emails except for logged in user.
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false)

      if (userId && userId === parent.id) return parent.email
      else return null
    } // resolve
  }, // email

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
