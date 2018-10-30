import uuidv4 from 'uuid/v4';

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email)

    if (emailTaken) {
      throw new Error('Email already in use.')
    }

    const user = {
      id: uuidv4(),
      ...args.data
    }

    db.users.push(user)
    return user
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex(user => user.id === args.id)

    if (userIndex === -1) {
      throw new Error ('User not found')
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter(post => {
      const match = post.author === args.id

      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id)
      }

      return !match
    })

    db.comments = db.comments.filter(comment => comment.author !== args.id)

    return deletedUsers[0]

  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;

    const user = db.users.find(user => user.id === id)

    if (!user) throw new Error('User not found ~')

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email)

      if (emailTaken) throw new Error('That email is already used.')

      user.email = data.email
    }

    if (typeof data.name === 'string') user.name = data.name
    if (typeof data.age !== 'undefined') user.age = data.age

    return user
  },

  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author)

    if (!userExists) {
      throw new Error('User doesn\'t exist.')
    }

    const post = {
      id: uuidv4(),
      ...args.data
    }

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })
    }

    db.posts.push(post)
    return post
  },
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
        mutation: 'CREATE',
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
        mutation: 'DELETE',
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
        mutation: 'UPDATE',
        data: comment
      }
    })

    return comment;
  }
}

export { Mutation as default }