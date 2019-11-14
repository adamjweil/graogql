const Query = {
    comments(parent, args, { db }, info) {
        return db.comments
    },
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users
        }
        return users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts 
        }

        return db.posts.filter((post) => {
            const titleMatch = args.title.toLowerCase().includes(args.query.toLowerCase())
            const bodyMatch = args.body.toLowerCase().includes(args.query.toLowerCase())
            return titleMatch || bodyMatch
        })
    },
    me() {
        return {
            id: '123abc',
            name: 'Adam',
            email: 'Adam@gmail.com',
            age: 30
        }
    },
    post() {
        return {
            id: '987sbhj',
            title: "GraphQL Title",
            body: "This is my Grapgql Body",
            published: true
        }
    }
}

export { Query as default }