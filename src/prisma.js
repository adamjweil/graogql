import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index';

const prisma = new Prisma({
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: 'http://localhost:4466',
	secret: 'thisistestsecret',
	fragmentReplacements
})

export { prisma as default }
// prisma.query prisma.mutation prisma.subscription prisma.exists 

// const createPostForUser = async (authorId, data) => {
// 	const userExists = await prisma.exists.User({ id: authorId })
// 	if (!userExists) {
// 		throw new Error('User not found')
// 	}
// 	const post = await prisma.mutation.createPost({
// 		data: {
// 			...data,
// 			author: {
// 				connect:{
// 					id: authorId
// 				}
// 			}
// 		}
// 	}, '{ author { id name email posts { id title published }} }')
// 	return post.author
// }

// const updatePostForUser = async (postId, data) => {
// 	const postExists = await prisma.exists.Post({ id: postId })
// 	if (!postExists) {
// 		throw new Error('Post not found')
// 	}
// 	const post = await prisma.mutation.updatePost({
// 		where: {
// 			id: postId
// 		},
// 		data
		
// 	}, '{ author { id name email posts { id title body published } } }')
// 	return post.author
// }

// updatePostForUser("ck34s5cph005y073254bjg1gg", {
// 	title: "22222",
// 	body: "war of art",
// 	published: false
// }).then((user) => {
// 	console.log(JSON.stringify(user, undefined, 2))
// }).catch((err) => {
// 	console.log(err)
// })

// createPostForUser("ck33w80g200xr0732bhd8qeyn", {
// 	title: "lindsay",
// 	body: "art",
// 	published: true
// }).then((user) => {
// 	console.log(JSON.stringify(user, undefined, 2))
// }).catch((err) => {
// 	console.log(err)
// })


// prisma.query.users(null, `{ id name email posts { id title body } }`).then((data) => {
// 	console.log(JSON.stringify(data, undefined, 4))
// }) 

// prisma.exists.Comment({
// 	id: "ck34rhswo00140732dpoykg9l",
// 	author: {
// 		id: "ck33w80g200xr0732bhd8qeyn"
// 	}
// }).then((data) => {
// 	console.log(data)
// })

