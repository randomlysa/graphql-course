import ApolloBoost, { gql } from 'apollo-boost'

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
})

// Get users.
const getUsers = gql`
  query {
    users {
      id
      name
    }
  }
`

client.query({
  query: getUsers
}).then(response => {
  let html = ''

  response.data.users.forEach(user => {
    html += `
      <div>
        <h3>${user.name}</h3>
      </div>
    `
  });

  document.getElementById('users').innerHTML = html
})

// Get posts.
const getPosts = gql`
  query {
    posts {
      title
      author {
        name
      }
    }
  }
`

client.query({
  query: getPosts
}).then(response => {
  let postHtml = '';

  response.data.posts.forEach(post => {
    postHtml += `
      <strong>${post.title}</strong> - <em>by ${post.author.name}</em><br>
    `
  })

  document.getElementById('posts').innerHTML = postHtml
})
