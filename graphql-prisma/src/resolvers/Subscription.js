import getUserId from "../utils/getUserId";

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
  }, // post

  myPost: {
    subscribe(parent, args , { prisma, request }, info) {
      const userId = getUserId(request)

      return prisma.subscription.post({
        where: {
          node: {
            author: {
              id: userId
            }
          }
        }
      }, info)
    } // subscribe
  } // myPost
} // const Subscription

export { Subscription as default }
