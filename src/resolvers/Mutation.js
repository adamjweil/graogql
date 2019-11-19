import uuidv4 from 'uuid/v4';

// Enum
// 1. A special type that defines a set of constants 
// 2. This type can be used as the type for a field (similar to scaler and custom object types)
// 3. Values for the field must be one of the constants for the type 

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const emailTaken = await prisma.exists.User({ email: args.data.email })
        
        if (emailTaken) { throw new Error('Email Taken')}
       
        return prisma.mutation.createUser({ data: args.data }, info)
    },
    async deleteUser(parent, args, { prisma }, info) {
        const userExists = await prisma.exists.User({ id: args.id})
        if (!userExists) { throw new Error('No User with that ID')}

        return prisma.mutation.deleteUser({ 
            where: {
                id: args.id
            }
        }, info)
    },
    async updateUser(parent, args, { prisma }, info) {
        return prisma.mutation.updateUser({ 
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    createPost(parent, args, { prisma, pubsub }, info) {
        return prisma.mutation.createPost({ 
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: args.data.author
                    }
                }
            }
        }, info)
    },
    deletePost(parent, args, { prisma, pubsub }, info) {
        return prisma.mutation.deletePost({ 
            where: {
                id: args.id
            }
        }, info)
    },
    updatePost(parent, args, { prisma, subsub }, info) {
        return prisma.mutation.updatePost({ 
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    createComment(parent, args, { prisma, pubsub }, info) {
        return prisma.mutation.createComment({ 
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: args.data.author
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },
    deleteComment(parent, args, { prisma, pubsub }, info) {
        return prisma.mutation.deleteComment({ 
            where: {
                id: args.id
            }
        }, info)
    },
    updateComment(parent, args, { prisma, pubsub }, info) {
        return prisma.mutation.updateComment({ 
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    }
}

export { Mutation as default }