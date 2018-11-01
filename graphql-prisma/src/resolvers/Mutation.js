import bcrypt from 'bcryptjs'

const Mutation = {
  // ES6 method, async goes in front.
  async createUser(parent, args, { prisma }, info) {
    // Check if email exists.
    const emailTaken = await prisma.exists.User({ email: args.data.email })
    if (emailTaken) throw new Error('Email already in use.')

    // Check if password is 8 characters or longer.
    if(args.data.password.length < 8) {
      throw new Error('Password must be 8 characters or more.')
    }

    // Hash the password.
    const password = await bcrypt.hash(args.data.password, 10)

    // Save info to database.
    return prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    }, info )
  }, // createUser

  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id })

    if (!userExists) throw new Error('Cannot delete user: user not found.')

    return prisma.mutation.deleteUser({
      where: { id: args.id }
    }, info)
  }, // deleteUser

  async updateUser(parent, args, { prisma }, info) {
    return prisma.mutation.updateUser({
      where: {
        id: args.id
      },
      data: args.data
    }, info)
  }, // updateUser

  async createPost(parent, args, { prisma, pubsub }, info) {
    const userExists = await prisma.exists.User({ id: args.data.author })

    if (!userExists) {
      throw new Error('Cannot create post: user doesn\'t exist')
    }

    // Send a notification if publish was set to true.
    if (args.data.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: args.data
        }
      })
    }

    // Create and return the post.
    return prisma.mutation.createPost({
      data: {
        ...args.data,
        author: {
          connect: {
            id: args.data.author
          }
        }
      }
    }, info)
  }, // createPost

  async deletePost(parent, args, { prisma, pubsub }, info) {
    const postExists = await prisma.exists.Post({ id: args.id})

    if (!postExists) {
      throw new Error ('Post ID not found ~')
    }

    // if (post.published) {
    //   pubsub.publish('post', {
    //     post: {
    //       mutation: 'DELETED',
    //       data: post
    //     }
    //   })
    // }

    return prisma.mutation.deletePost({
      where: { id: args.id }
    }, info)
  }, // deletePost

  updatePost(parent, args, { prisma, pubsub }, info) {
    return prisma.mutation.updatePost({
      where: {
        id: args.id
      },
      data: args.data
    }, info)
  }, //updatePost

  createComment(parent, args, { prisma, pubsub }, info) {
    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: args.data.author
          }
        },
        post: {
          connect: {
            id: args.data.post
          }
        }
      }
    }, info)
  }, // createComment

  deleteComment(parent, args, { prisma, pubsub }, info) {
    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info)
  }, // deleteComment

  updateComment(parent, args, { prisma, pubsub }, info) {
    return prisma.mutation.updateComment({
      where: {
        id: args.id
      },
      data: args.data
    }, info)
  } // updateComment

} // const Mutation

export { Mutation as default }
