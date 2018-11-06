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

const seedDatabase = async () => {
  // Delete test data
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  // Create userOne
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  })
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  await prisma.mutation.createPost({
    data: {
      title: 'Exmaple Post 1 (Published)',
      published: true,
      body: '',
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })
  await prisma.mutation.createPost({
    data: {
      title: 'Exmaple Post 1 (Draft)',
      published: false,
      body: '',
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })
}

export { seedDatabase as default, userOne }
