import getUserId from '../utils/getUserId';
import { request } from 'express';

const Query = {
    users(parent, args, { prisma }, info) {
        let opArgs = {}

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }, {
                    email_contains: args.query
                }]
            }
        }
        return prisma.query.users(opArgs, info) 
    },
    posts(parent, args, { prisma }, info) {
        let opArgs = {
            where: {
                published: true
            }
        }
        if (args.query) {
            opArgs.where.OR = [{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }] 
        }
        return prisma.query.posts(opArgs, info)
    },
    myPosts(parent, args, {prisma, request}, info) {
        const userId = getUserId(request)
        const opArgs = {
            where: {
                author: {
                    id: userId
                }
            }
        }

        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }
        return prisma.query.posts(opArgs, info)
    },
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)
        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{
                    published: true
                }, {
                    author: {
                        id: userId
                    }
                }]
            }
        }, info)

        if (posts.length === 0) {
            throw new Error('Post not found')
        }
        return posts[0]
    },
    comments(parent, args, { prisma }, info) {
        return prisma.query.comments(null, info)
    },
    me(parent, args, { prisma , request }, info) {
        const userId = getUserId(request)
        return prisma.query.user({
            where: {
                id: userId
            }
        }, info)
    },
}

export { Query as default }