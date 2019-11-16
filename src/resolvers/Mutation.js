import uuidv4 from 'uuid/v4';

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
    createPost(parent, args, { db }, info) {
       
        const userExists = db.users.some((user) => user.id === args.author)
        console.log(parent)
        if (!userExists) {
            throw new Error('User not found')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post)
        return post
    },
    deletePost(parent, args, { db }, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id)

        if (postIndex === -1) {
            throw new Error('Post not found')
        }
        const deletePost = db.posts.splice(postIndex, 1)
        db.comments = db.comments.filter((comment) => comment.post !== args.id)
        return deletePost[0]
    },
    updatePost(parent, args, { db }, info) {
        const { id, data } = args 
        const post = db.posts.find((post) => post.id === id)

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
        }
        return post
    },
    createComment(parent, args, { db }, info) {
        const userExists = db.users.some((user) => user.id === args.author)
        const postExists = db.posts.some((post) => post.id === args.post && post.published)

        if (!userExists || !postExists) {
            throw new Error('Unable to find User and Post')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }
        db.comments.push(comment)
        return comment
    },
    deleteComment(parent, args, { db }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

        if (commentIndex === -1) {
            throw new Error("Comment not found")
        }
        const deleteComment = db.comments.splice(commentIndex, 1) 
        db.comments = db.comments.filter((comment) => comment.id !== args.id)
        return deleteComment[0]
    },
    updateComment(parent, args, { db }, info) {
        const { id, data } = args 
        const comment = db.comments.find((comment) => comment.id === id)

        if (!comment) {
            throw new Error('Cannot find this comment')
        }

        if (typeof data.body === 'string') {
            comment.body = data.body
        }
        return comment
    }
}

export { Mutation as default }