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
      }, info)
    }
  },
  post: {
    subscribe(parent, args , { pubsub }, info) {
      // const post = db.posts.find(post => post.id === postId && post.published)
      // if (!post) throw new Error ('Post not found or not published')
      return pubsub.asyncIterator('post')
    }
  }
}

export { Subscription as default }
