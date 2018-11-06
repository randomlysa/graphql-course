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

test('Should expose public author profiles', async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `
  const response = await client.query({ query: getUsers })

  expect(response.data.users.length).toBe(1)
  expect(response.data.users[0].email).toBe(null)
  expect(response.data.users[0].name).toBe('User1')
})

test('Should expose published posts', async () => {
  const getPosts = gql`
    query {
      posts {
        title
        published
      }
    }
  `
  const response = await client.query({ query: getPosts })

  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
})

test('Should not login with bad credentials', async () => {
  const login = gql`
    mutation {
      loginUser(
        data: {
          email: "user1@example.com",
          password: "zxc098!@#"
        }
      ) {
        name
      }
    }
  `

  await expect(
    client.mutate({ mutation: login})
  ).rejects.toThrow()
}) // Should not login with bad credentials

test('Should not create user with password < 8 characters', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "test",
          email: "test@test.com",
          password: "short"
        }
      ) {
        token
      }
    }
  `;

  await expect(
    client.mutate({ mutation: createUser })
  ).rejects.toThrow()
}) // Should not create user with password < 8 characters
