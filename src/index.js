import { GraphQLServer } from 'graphql-yoga'

const users = [{
    id: "1",
    name: "Adam",
    age: 23,
    email: "adam@adam.com"
}, {
    id: "3",
    name: "Matt",
    age: 33,
    email: "mjw@weil.com"
}, {
    id: "4",
    name: "Linkz",
    age: 27,
    email: "lbw@weil.com"
}]

const posts = [{
    id: "1",
    title: "Title-1",
    body: "Body or 1",
    published: true,
    author: '1',
}, {
    id: "3",
    title: "Title-3",
    body: "Body or 3",
    published: true,
    author: '1'
}, {
    id: "4",
    title: "Title-4",
    body: "Body for 4",
    published: true,
    author: '4'
}]

const comments = [{
    id: "1",
    body: "Body or 1",
    author: '1',
    post: '1'
}, {
    id: "3",
    body: "Body or 3",
    author: '1',
    post: '3'
}, {
    id: "4",
    body: "Body for 4",
    author: '1',
    post: '3'
}, {
    id: '2',
    body: 'Body for 2',
    author: '1',
    post: '4'
}]

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!

        comment: Comment!
        me: User!
        post: Post!
        author: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        body: String!
        author: User!
        posts: Post!
    }
`
// Resolvers
const resolvers = {
    Query: {
        comments(parent, args) {
            return comments
        },
        users(parent,args,ctx,info) {
            if (!args.query) {
                return users
            }
            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent,args,ctx,info) {
            if (!args.query) {
                return posts 
            }

            return posts.filter((post) => {
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
        },
    },

    Post: {
        author(parent,args,ctx,info) {
            return users.find((user) => {
                return user.id === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },

    Comment: {
        author(parent,args,ctx,info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        posts(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
        }
    },

    User: {
        posts(parent,args,ctx,info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === user.id
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})


server.start(() => {
    console.log('The server is up!')
})
