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

  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.id)

    if (postIndex === -1) {
      throw new Error ('Post ID not found ~')
    }

    // Destructure the one post that was spliced.
    const [ post ] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(comment => comment.post !== args.id)

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }

    return post
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;

    const post = db.posts.find(post => post.id === id)
    if (!post) throw new Error('Post not found!')
    // Make a copy of the post.
    const originalPost = { ...post };

    if (typeof data.title === 'string') post.title = data.title
    if (typeof data.body === 'string') post.body = data.body

    if (typeof data.published === 'boolean') {
      post.published = data.published

      if (originalPost.published === true && !post.published) {
        // Unpublished event.
        pubsub.publish('post', {
          post: {
            mutation: 'UNPUBLISHED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && post.published) {
        // Published event.
        pubsub.publish('post', {
          post: {
            mutation: 'PUBLISHED',
            data: post
          }
        })
      }

    } else if (post.published) {
      // Updated.
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    } // else if -- typeof data.published === 'boolean'

    if (typeof data.author === 'string') {
      const userIdExists = db.users.find(user => user.id === data.author)
      if (!userIdExists) throw new Error('New author id not found')
      post.author = data.author
    }

    return post
  },

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
