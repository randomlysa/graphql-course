import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'

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
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    })

    // Return user and token
    return {
      user,
      token: jwt.sign({ userId: user.id }, 'jwt_secret_token')
    }
  }, // createUser

  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info)
  }, // deleteUser

  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: args.data
    }, info)
  }, // updateUser

  async loginUser(parent, args, { prisma}, info) {
    const emailExists = await prisma.exists.User({ email: args.data.email })
    if (!emailExists) throw new Error('Unable to login.')

    const user = await prisma.query.user({
      where : {
        email: args.data.email
      }
    })

    const checkPassword = await bcrypt.compare(args.data.password, user.password)
    if(!checkPassword) throw new Error('Unable to login.')

    // Return user and token
    return {
      user,
      token: jwt.sign({ userId: user.id }, 'jwt_secret_token')
    }
  },

  async createPost(parent, args, { prisma, request }, info) {
    // Send request (which has HTTP headers) to getUserId.
    // getUserId gets the token from header and verifies it,
    // returning the user id if successful.
    const userId = getUserId(request)

    const userExists = await prisma.exists.User({ id: args.data.author })
    if (!userExists) {
      throw new Error('Cannot create post: user doesn\'t exist')
    }

    // Create and return the post.
    return prisma.mutation.createPost({
      data: {
        ...args.data,
        author: {
          connect: {
            id: userId
          }
        }
      }
    }, info)
  }, // createPost

  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })

    if (!postExists) {
      throw new Error ('Unable to delete post.')
    }

    return prisma.mutation.deletePost({
      where: { id: args.id }
    }, info)
  }, // deletePost

  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })

    if (!postExists) throw new Error ('Unable to update post.')

    return prisma.mutation.updatePost({
      where: {
        id: args.id
      },
      data: args.data
    }, info)
  }, //updatePost

  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const postIsPublished = await prisma.exists.Post({
      id: args.data.post,
      published: true
    })
    if (!postIsPublished) throw new Error('Could not create comment.')

    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: userId
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

  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    }) // commentExists

    if (!commentExists) throw new Error('Unable to delete comment')

    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info)
  }, // deleteComment

  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    }) // commentExists

    if (!commentExists) throw new Error('Unable to update comment')

    return prisma.mutation.updateComment({
      where: {
        id: args.id
      },
      data: args.data
    }, info)
  } // updateComment

} // const Mutation

export { Mutation as default }
