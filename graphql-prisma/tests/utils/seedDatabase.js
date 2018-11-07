import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma';

const userOne = {
  input: {
    name: 'User1',
    email: 'user1@example.com',
    password: bcrypt.hashSync('zxc098!@#')
  },
  user: undefined,
  jwt: undefined
}

const userTwo = {
  input: {
    name: 'User2',
    email: 'user2@example.com',
    password: bcrypt.hashSync('zxc098!@#')
  },
  user: undefined,
  jwt: undefined
}

const postOne = {
  input: {
      title: 'Exmaple Post 1 (Published)',
      published: true,
      body: '',
  },
  post: undefined
}

const postTwo = {
  input: {
    title: 'Exmaple Post 1 (Draft)',
    published: false,
    body: '',
  },
  post: undefined
}

const commentOne = {
  comment: undefined
}

const commentTwo = {
  comment: undefined
}

const seedDatabase = async () => {
  // Delete test data
  await prisma.mutation.deleteManyComments()
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  // Create userOne using userOne.input values and assign jwt to userOne.jwt
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  })
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  // Create userTwo
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input
  })
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

  // Create postOne using postOne.input values and assign it to postOne.post
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  }) // Create postOne

  // Create a second post.
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  }) // Create a second post

  // Create a comment on post one by userTwo.
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      text: 'A comment on post one by userTwo',
      author: {
        connect: {
          id: userTwo.user.id
        }
      },
      post: {
        connect: {
          id: postOne.post.id
        }
      }
    }
  }) // Create a comment on post one by userTwo.

  // Create a comment on post one by userOne.
  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      text: 'A comment on post one by userOne',
      author: {
        connect: {
          id: userOne.user.id
        }
      },
      post: {
        connect: {
          id: postOne.post.id
        }
      }
    }
  }) // Create a comment on post one by userOne.

} // const seedDatabase


export { seedDatabase as default,
        userOne, userTwo,
        postOne, postTwo,
        commentOne, commentTwo
}
