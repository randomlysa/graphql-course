const Subscription = {
  comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      return prisma.subscription.comment({
        where: {
          node: {
            post: {
              id: postId
            }
          }
        }
      }, info) // return
    } // subscribe
  }, // comment

  post: {
    subscribe(parent, args , { prisma }, info) {
      return prisma.subscription.post({
        where: {
          node: {
            published: true
          }
        }
      }, info) // return
    } // subscribe
  } // post
} // const Subscription

export { Subscription as default }
