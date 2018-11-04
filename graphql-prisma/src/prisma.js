import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements
})

export { prisma as default }

// const createPostForUser = async (authorId, data) => {

//   const userExists = await prisma.exists.User({
//     id: authorId
//   })

//   if (!userExists) throw new Error ('User NOT FOUND')

//   const post = await prisma.mutation.createPost({
//     data: {
//       ...data,
//       author: {
//         connect: {
//           id: authorId
//         }
//       }
//     }
//   }, '{ author { id name email posts { id title body published } } }')

//   return post
// } // createPostForUser

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({
//     id: postId
//   })

//   if (!postExists) throw new Error("Post NOT FOUND")

//   const post = await prisma.mutation.updatePost({
//     where: {
//       id: postId
//     },
//     data: {
//       ...data
//     }

//   }, '{ id title body author { id email posts { id title body } } }')
//   return post
// } // updatePostForUser


// updatePostForUser('55', {
//     body: 'we need a body here! x15'
// }).then(data => {
//   console.log(JSON.stringify(data, undefined, 2))
// }).catch(e => {
//   console.log(e)
//  })

// createPostForUser('cjnwdc7v7002m0873gy3q45yb', {
//   title: 'I miss Tenerife',
//   body: 'It was so cold! And cool ~',
//   published: true
// }).then(data => {
//   console.log(JSON.stringify(data, undefined, 2))
// }).catch(e => console.log(e.message))
