import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma';

const seedDatabase = async () => {
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()
  const user = await  prisma.mutation.createUser({
    data: {
      name: 'User1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('zxc098!@#')

    }
  })
  await prisma.mutation.createPost({
    data: {
      title: 'Exmaple Post 1 (Published)',
      published: true,
      body: '',
      author: {
        connect: {
          id: user.id
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
          id: user.id
        }
      }
    }
  })
}

export { seedDatabase as default }
