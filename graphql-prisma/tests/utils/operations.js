import { gql } from 'apollo-boost'

// Queries that may be reused in tests.
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

export { createUser, getUsers, login, getProfile }
