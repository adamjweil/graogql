import uuidv4 from 'uuid/v4';

// Enum
// 1. A special type that defines a set of constants 
// 2. This type can be used as the type for a field (similar to scaler and custom object types)
// 3. Values for the field must be one of the constants for the type 

const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some((user) => user.email === args.email)

        if (emailTaken) {
            throw new Error('Email Taken.')
        }

        const user = {
            id: uuidv4(),
            ...args.data
        }

        db.users.push(user)
        return user
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) => user.id === args.id)

        if (userIndex === -1) {
            throw new Error('User not Found')
        }

        const deleteUser = db.users.splice(userIndex, 1)
        posts = db.posts.filter((post) => {
            const match = db.post.author === args.id 

            if (match) {
                comments = db.comments.filter((comment) => comment.post !== post.id)
            }
            return !match 
        })
        comments = db.comments.filter((comment) => comment.author !== args.id)
        return db.deleteUser[0]
    },
    updateUser(parent, args, { db }, info) {
        const { id, data } = args
        const user = db.users.find((user) => user.id === id)

        if (!user) {
            throw new Error('No User Found')
        }
        if (typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => user.email === data.email)

            if (emailTaken) {
                throw new Error('Email Taken')
            }
            user.email = data.email
        }
            if (typeof data.name === 'string') {
                user.name = data.name
            }
            if (typeof data.age !== 'undefined') {
                user.age = data.age
            }
        return user
    },
    createPost(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)
        
        if (!userExists) {
            throw new Error('User not found')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post)
        if (post.published) {
            pubsub.publish("post", { 
                post: {
                    mutation: 'CREATED',
                    data: post
                }
             })
        }
        return post
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id)

        if (postIndex === -1) {
            throw new Error('Post not found')
        }
        const deletedPost = db.posts.splice(postIndex, 1)
        db.comments = db.comments.filter((comment) => comment.post !== args.id)

        if (deletedPost[0].published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deletedPost[0]
                }
            })
        }
        return deletedPost[0]
    },
    updatePost(parent, args, { db, subsub }, info) {
        const { id, data } = args 
        const post = db.posts.find((post) => post.id === id)
        const originalPost = { ...post }

        if (!post) {
            throw new Error('Cannot Find this post')
        }
        if (typeof data.title === 'string') {
            post.title = data.title
        }
        if (typeof data.body === 'string') {
            post.body = data.body
        }
        if (typeof data.published === 'boolean') {
            post.published = data.published

            if (originalPost.published.true && !post.published) {
                pubsub.publish('post', {
                    mutation: 'DELETED',
                    data: originalPost
                 
              })
            } else if (!originalPost.published && post.pubished) {
                pubsub.publish('post', {
                    mutation: 'CREATED',
                    data: post
                
            })
          
        } else if (post.published) {
            pubsun.publish('post', {
                mutation: 'UPDATED',
                data: post
               
            })
        }
    }
        return post
    },
    createComment(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)
        const postExists = db.posts.some((post) => post.id === args.data.post && post.published)

        if (!userExists || !postExists) {
            throw new Error('Unable to find User and Post')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment)
        pubsub.publish(`comment ${args.data.post}`, { 
            comment: {
                mutation: 'CREATED',
                data: comment
            }
         })
        return comment
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

        if (commentIndex === -1) {
            throw new Error("Comment not found")
        }
        const deletedComment = db.comments.splice(commentIndex, 1) 
        db.comments = db.comments.filter((comment) => comment.id !== args.id)
        pubsub.publish(`comment ${comment.post}`, {
            mutation: 'DELETED',
            data: deletedComment[0]
        })
        return deletedComment[0]
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const { id, data } = args 
        const comment = db.comments.find((comment) => comment.id === id)

        if (!comment) {
            throw new Error('Cannot find this comment')
        }

        if (typeof data.body === 'string') {
            comment.body = data.body
        }
        pubsub.publish(`comment ${comment.post}`, {
            mutation: 'UPDATED',
            data: comment
        })
        return comment
    }
}

export { Mutation as default }