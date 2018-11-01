import getUserId from '../utils/getUserId'

const Query = {
  // ES6 method syntax.
    users(parent, args, { prisma }, info) {
      const opArgs = {}

      if (args.query) {
        opArgs.where = {
          OR : [{
            name_contains: args.query
            }, {
            email_contains: args.query
          }]
        }
      } // if (args.query)

      return prisma.query.users(opArgs, info)

    }, // Query users
    posts(parent, args, { prisma }, info) {
      const opArgs = {}

      if (args.query) {
        opArgs.where = {
          OR : [{
            title_contains: args.query
          }, {
            body_contains: args.query
          }]
        }
      } // if (args.query)

      return prisma.query.posts(opArgs, info)
    }, // Query posts
    comments(parent, args, { prisma }, info) {
      return prisma.query.comments(null, info)
    }, // Query comments

    async post(parent, args, { prisma, request }, info) {
      // Get userId but don't require it.
      const userId = getUserId(request, false)

      // Get post by id *if* it's published or if logged in user
      // is the author. Don't let a user get someone else's not
      // published posts.
      const posts = await prisma.query.posts({
        where: {
          id: args.id,
          OR: [{
            published: true
          }, {
            author: {
              id: userId
            }
          }]
        }
      }, info)

      if(posts.length === 0) throw new Error('Post not found')

      return posts[0]
    }
}

export { Query as default }
