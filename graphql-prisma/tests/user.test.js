import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, getUsers, login, getProfile } from './utils/operations'

// Genertic getClient without auth
const client = getClient()
// Set up database.
beforeEach(seedDatabase)

test('Should create a new user', async () => {
  const variables = {
    data: {
      name: 'bob',
      email: 'bob@example.com',
      password: 'apasswd44'
    }
  }

  const response = await client.mutate({
    mutation: createUser,
    variables
  })

  const exists = await prisma.exists.User({ id: response.data.createUser.user.id })

  expect(exists).toBe(true);
}) // should create a new user

test('Should expose public author profiles (no email addresses)', async () => {
  const response = await client.query({ query: getUsers })

  expect(response.data.users.length).toBe(1)
  expect(response.data.users[0].email).toBe(null)
  expect(response.data.users[0].name).toBe('User1')
}) // Should expose public author profiles (no email addresses)

test('Should not login with bad credentials', async () => {
  const variables = {
    data: {
      name: 'bob',
      password: 'wrongpwd'
    }
  }

  await expect(
    client.mutate({
      mutation: login,
      variables
    })
  ).rejects.toThrow()
}) // Should not login with bad credentials

test('Should not create user with password < 8 characters', async () => {
  const variables = {
    data: {
      name: 'testuser',
      email: 'testuser@test.com',
      password: 'short'
    }
  }

  await expect(
    client.mutate({
      mutation: createUser,
      variables
    })
  ).rejects.toThrow()
}) // Should not create user with password < 8 characters

test('Should fetch user profile if authenticated', async () => {
  const client = getClient(userOne.jwt)

  const { data } = await client.query({ query: getProfile })

  expect(data.me.id).toBe(userOne.user.id)
  expect(data.me.name).toBe(userOne.user.name)
  expect(data.me.email).toBe(userOne.user.email)
})
