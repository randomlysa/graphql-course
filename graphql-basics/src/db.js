const users = [
  {
    id: '50',
    name: 'Bob',
    email: 'noemail@bob.com'
  }, {
    id: '51',
    name: 'Jim',
    email: 'phil@rawr.go'
  }, {
    id: '55',
    name: 'Joe',
    email: 'mr@5.com'
}, {
    id: '56',
    name: 'No Posts',
    email: 'noposts@google.com'
}];

const posts = [{
  "id": "60",
  "title": "Mat Lam Tam",
  "body": "Diverse mission-critical budgetary management",
  "published": true,
  "author": "50"
}, {
  "id": "61",
  "title": "Subin",
  "body": "Up-sized discrete forecast",
  "published": false,
  "author": "50"
}, {
  "id": "62",
  "title": "Daltfresh",
  "body": "Customer-focused reciprocal initiative",
  "published": true,
  "author": "50"
}, {
  "id": "63",
  "title": "Biodex",
  "body": "Diverse tertiary matrix",
  "published": true,
  "author": "55"
}];

const comments = [{
  id: "123",
  text: "I wish this were blank",
  author: "50",
  post: "60"
}, {
  id: "124",
  text: "Let's read a good book",
  author: "55",
  post: "60"
}, {
  id: "125",
  text: "It's my birthday also!",
  author: "55",
  post: "61"
}, {
  id: "126",
  text: "Happy mew year~",
  author: "50",
  post: "62"
}, {
  id: '127',
  text: 'Dont delete this please',
  author: '56',
  post: '63'
}];

const db = {
  users,
  posts,
  comments
}

export {db as default}