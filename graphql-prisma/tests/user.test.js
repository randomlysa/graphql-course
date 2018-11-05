import 'cross-fetch/polyfill'
import ApolloBoost, { gql } from 'apollo-boost'
import bcrypt from 'bcryptjs'
import '../src/prisma'
import prisma from '../src/prisma';

const client = new ApolloBoost({
  uri: 'http://localhost:4001'
})

beforeEach(async() => {
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
});

test('Should create a new user', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Alex",
          email: "alex@example.com",
          password: "myPass123"
        }
      ){
        token
        user {
          id
          email
        }
      }
    }
  `

  const response = await client.mutate({
    mutation: createUser
  })

  const exists = await prisma.exists.User({ id: response.data.createUser.user.id })

  expect(exists).toBe(true);
}) // should create a new user
