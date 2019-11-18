import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: 'http://localhost:4466'
})

// prisma.query prisma.mutation prisma.subscription prisma.exists 

prisma.query.users(null, `{ id name email posts { id title body } }`).then((data) => {
	console.log(JSON.stringify(data, undefined, 4))
}) 

// prisma.query.comments(null, `{ id text author { id name } }`).then((data) => {
// 	console.log(JSON.stringify(data, undefined, 4))
// })


// prisma.mutation.createPost({
// 	data: {
// 		title: "My new post",
// 		body: "new bod",
// 		published: true,
// 		author: {
// 			connect:{
// 				id:"ck33w80g200xr0732bhd8qeyn"
// 			}
// 		}
// 	}
// }, '{ id title body published }').then((data) => {
// 	console.log(JSON.stringify(data))
// })
