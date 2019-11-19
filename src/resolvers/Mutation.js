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
    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.mutation.deleteUser({ 
            where: {
                id: userId
            }
        }, info)
    },
    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.mutation.updateUser({ 
            where: {
                id: userId
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
     async deletePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        }) 
        if (!postExists) {
            throw new Error('Cannot delete post')
        }
        return prisma.mutation.deletePost({ 
            where: {
                id: args.id
            }
        }, info)
    },
    async updatePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const postBelongsToUser = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        }) 

        const isPublished = await prisma.exists.Post({ id: args.id, published: true })
        if (!isPublished) {
            throw new Error('Unale to update post')
        }

        if (!postBelongsToUser) {
            throw new Error('Post does not belong to you')
        }

        if (isPublished && args.data.published === false) {
            await prisma.mutation.deleteManyComments({ where: { post: { id: args.id } } })
        }
        return prisma.mutation.updatePost({ 
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    async createComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
                id: args.data.post,
                published: true
        })

        if (!postExists) { throw new Error('No post')}

        return prisma.mutation.createComment({ 
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
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
    async deleteComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const commentBelongsToUser = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })
        if (!commentBelongsToUser) { throw new Error('Cant delete comment') }

        return prisma.mutation.deleteComment({ 
            where: {
                id: args.id
            }
        }, info)
    },
    async updateComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })
        if (!commentExists) { throw new Error('Not your comment')}
        return prisma.mutation.updateComment({ 
            where: {
                id: args.id,
            },
            data: args.data
        }, info)
    }
}

export { Mutation as default }