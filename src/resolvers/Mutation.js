import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';
// Enum
// 1. A special type that defines a set of constants 
// 2. This type can be used as the type for a field (similar to scaler and custom object types)
// 3. Values for the field must be one of the constants for the type 

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        if (args.data.password.length < 8) {
            throw new Error('Passwords must be 8 characters long.')
        }
        const password = await bcrypt.hash(args.data.password, 10) 
        const user = await prisma.mutation.createUser({ 
            data: {
                ...args.data,
                password
            }
        })
        return {
            user,
            token: jwt.sign({ userId: user.id }, 'thisisasecret')
        }
    },
    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
                }
            })

        if (!user) {
            throw new Error('Cannot Find User')
        }

        const isMatch = bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }
        return {
            user,
            token: jwt.sign({ userId: user.id }, 'thisisasecret')
        }
    },
    async deleteUser(parent, args, { prisma }, info) {
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
    createPost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.mutation.createPost({ 
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: userId
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