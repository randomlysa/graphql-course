import 'cross-fetch/polyfill'
import ApolloBoost, { gql } from 'apollo-boost'
import '../src/prisma'
import prisma from '../src/prisma';

const client = new ApolloBoost({
  uri: 'http://localhost:4001'
})

beforeEach(async() => {
  await prisma.mutation.deleteManyUsers()
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
