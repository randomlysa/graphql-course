import { gql } from 'apollo-boost'

// Queries that may be reused in tests.
// Begin user section.
const createUser = gql`
  mutation( $data: CreateUserInput! ) {
    createUser(
      data: $data
    ){
      token
      user {
        id
        name
        email
      }
    }
  }
` // const createUser

const getUsers = gql`
query {
  users {
    id
    name
    email
  }
}
` // const getUsers

const login = gql`
  mutation( $data: LoginUserInput! ) {
    loginUser(
      data: $data
    ) {
      name
    }
  }
` // const login

const getProfile = gql`
  query {
    me {
      id
      name
      email
    }
  }
` // const getProfile

// End user section.
// Begin post section.

const getPosts = gql`
  query {
    posts {
      title
      published
    }
  }
` // const getPosts

const myPosts = gql`
  query {
    myPosts {
      id
      title
      published
    }
  }
` // const myPosts

const updatePost = gql`
  mutation ( $id: ID!, $data: UpdatePostInput! ) {
    updatePost (
      id: $id,
      data: $data
    ) {
      id
      title
      body
      published
    }
  }
` // const updatePost

const createPost = gql`
  mutation ( $data: CreatePostInput! ) {
    createPost ( data: $data ) {
      id
      title
      body
      published
    }
  }
` // const createPost

const deletePost = gql`
  mutation ( $id: ID! ) {
    deletePost ( id: $id ) {
      id
    }
  }
` // deletePost

const deleteComment = gql`
  mutation ( $id: ID! ) {
    deleteComment ( id: $id ) {
      id
    }
  }
` // deleteComment

export {
  createUser, getUsers, login, getProfile,
  getPosts, myPosts, updatePost, createPost, deletePost,
  deleteComment
}

