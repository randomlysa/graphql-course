import uuidv4 from 'uuid/v4';

const Mutation = {
  // ES6 method, async goes in front.
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email })

    if (emailTaken) throw new Error('Email already in use.')

    return prisma.mutation.createUser({
      data: args.data
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

  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author)

    if (!userExists) {
      throw new Error('User doesn\'t exist.')
    }

    const postExists = db.posts.find(post => post.id === args.data.post)
    if (!postExists) {
      throw new Error('Post not found.')
    }

    if (postExists && !postExists.published) {
      throw new Error('Post is not published yet.')
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    }

    db.comments.push(comment)
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    })
    return comment
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(comment => comment.id === args.id);
    if (commentIndex === -1) throw new Error('Comment not found ~')

    const [ comment ] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    })
    return comment
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find(comment => comment.id === id)

    if (!comment) throw new Error('Comment not found')

    if (typeof data.text === 'string') comment.text = data.text;

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })

    return comment;
  }
}

export { Mutation as default }
