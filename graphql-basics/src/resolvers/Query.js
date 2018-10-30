const Query = {
  // ES6 method syntax.
    users(parent, args, { db }, info) {
      if (args.query) {
        return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
      } else {
        return db.users
      }
    },
    posts(parent, args, { db }, info) {
      if (args.query) {
          return db.posts.filter(post => {
            if (
              post.title.toLowerCase().includes(args.query.toLowerCase()) ||
              post.body.toLowerCase().includes(args.query.toLowerCase())
            ) return post;
          })
          // posts.filter(post => post.body.toLowerCase().includes(args.query.toLowerCase()))
      } else {
        return db.posts
      }
    },
    comments(parent, args, { db }, info) {
      return db.comments
    }
}

export { Query as default }