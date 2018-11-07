import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userTwo, commentOne, commentTwo, postOne, userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { deleteComment, subscribeToComments } from './utils/operations'


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

test('Should subscribe to comments for a post', async (done) => {
  const variables = {
    postId: postOne.post.id
  }

  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next(response) {
      expect(response.data.comment.mutation).toBe('DELETED')
      done()
    }
  })

  await prisma.mutation.deleteComment({ where: {id: commentOne.comment.id }})
}) // Should subscribe to comments for a post
