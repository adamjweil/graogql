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
    }
}

export { Mutation as default }