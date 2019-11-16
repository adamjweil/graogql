import { GraphQLServer } from 'graphql-yoga';
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'
import User from './resolvers/User'
import db from './db';


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Post,
        User,
        Comment
    },
    context: {
        db

    }
})


server.start(() => {
    console.log('The server is up!')
})
