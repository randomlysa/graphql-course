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

const seedDatabase = async () => {
  // Delete test data
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  // Create userOne using userOne.input values and assign jwt to userOne.jwt
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  })
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

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
  })

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
  })
}

export { seedDatabase as default, userOne, postOne, postTwo }
