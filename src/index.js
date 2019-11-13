import { GraphQLServer } from 'graphql-yoga'


const users = [{
    id: '1',
    name: 'adam',
    email: 'adam@email.com'
}, {
    id: '2',
    name: 'bill', email: 'bill@bill.com', age: 30
}, {
    id: '3',
    name: 'Willy',
    email: 'Smith@willy.com'
}]

const posts = [{
    id: '1',
    title: 'Title 1',
    body: "This is my bodyyy",
    published: true
}, {
    id: '2',
    title: 'Title 2', 
    body: "This is my bodyyy", 
    published: true
}, {
    id: '3',
    title: 'Title 3',
    body: "This is my bodyyyyyy", 
    published: false
}]

// Type Definitions (schema)
const typeDefs = `
    type Query { 
        users(query: String): [User!]!
        posts(query: String): [Post!]!     
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }

    
`
// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }
            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }
            return posts.filter((post) => {
                return (post.title.toLowerCase() || post.body.toLowerCase()).includes(args.query.toLowerCase())
            })
        },
        me() {
            return {
                id: '123098',
                name: 'mike',
                email: 'adam',
                age: 28
            }
        },
        post() {
            return {
                id: '123abc',
                title: 'My title',
                body: 'This is the body',
                published: false
            }
        },
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log(`server is up`)
})