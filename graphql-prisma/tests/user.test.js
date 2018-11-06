import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import jwt from 'jsonwebtoken'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()
beforeEach(seedDatabase);

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

test('Should expose public author profiles (no email addresses)', async () => {
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
}) // Should expose public author profiles (no email addresses)

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

test('Should fetch user profile if authenticated', async () => {
  const client = getClient(userOne.jwt)
  const getProfile = gql`
    query {
      me {
        id
        name
        email
      }
    }
  `
  const { data } = await client.query({ query: getProfile })

  expect(data.me.id).toBe(userOne.user.id)
  expect(data.me.name).toBe(userOne.user.name)
  expect(data.me.email).toBe(userOne.user.email)
})
