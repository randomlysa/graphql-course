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
    }
}

export { Query as default }
