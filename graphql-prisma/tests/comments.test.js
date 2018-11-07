import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userTwo, commentOne, commentTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { deleteComment } from './utils/operations'

// Genertic getClient without auth
const client = getClient()
// Set up database.
beforeEach(seedDatabase)

test('Should delete own comment', async () => {
  // commentOne was created by userTwo
  // Auth as userTwo
  const client = getClient(userTwo.jwt)

  const variables = {
    id: commentOne.comment.id
  }

  const { data } = await client.mutate({
    mutation: deleteComment,
    variables
  })

  const commentExists = await prisma.exists.Comment({ id: data.deleteComment.id})
  expect(commentExists).toBe(false)
}) // Should delete own comment

test('Should not delete comment of other user', async () => {
  // commentTwo was created by userOne, so run the test as userTwo
  // Auth as userTwo
  const client = getClient(userTwo.jwt)

  const variables = {
    id: commentTwo.comment.id
  }

  await expect(
    client.mutate({
      mutation: deleteComment,
      variables
    })
  ).rejects.toThrow()
})
