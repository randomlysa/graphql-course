import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import prisma from '../src/prisma'
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { getPosts, myPosts, updatePost, createPost, deletePost } from './utils/operations'

const client = getClient()
beforeEach(seedDatabase);

test('Should show only published posts', async () => {
  const response = await client.query({ query: getPosts })

  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
}) // Should show only published posts

test('Should get myPosts (published and not)', async () => {
  const client = getClient(userOne.jwt)

  const { data } = await client.query({ query: myPosts })

  expect(data.myPosts.length).toBe(2)
}) // Should get myPosts (published and not)

test('Should be able to update own post', async () => {
  const client = getClient(userOne.jwt)

  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  }

  const { data } = await client.mutate({
      mutation: updatePost,
      variables
  })
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  })

  expect(data.updatePost.published).toBe(false)
  expect(exists).toBe(true)
}) // Should be able to update own post

test('Should be able to create a post', async () => {
  const client = getClient(userOne.jwt)

  const variables = {
    data: {
      title: "A test post",
      body: "",
      published: true
    }
  }

  const { data } = await client.mutate({
    mutation: createPost,
    variables
  })
  const exists = await prisma.exists.Post({ id: data.createPost.id })

  expect(data.createPost.title).toBe('A test post')
  expect(data.createPost.published).toBe(true)
  expect(exists).toBe(true)
}) // Should be able to create a post

test('Should be able to delete a post', async () => {
  const client = getClient(userOne.jwt)

  const variables = {
    id: postTwo.post.id
  }

  await client.mutate({
    mutation: deletePost,
    variables
  })
  const exists = await prisma.exists.Post({ id: postTwo.post.id })

  expect(exists).toBe(false)
}) // Should be able to delete a post
