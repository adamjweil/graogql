const Subscription = {
	comment: {
		subscribe(parent, { postId }, { pubsub, db }, info) {
			const post = db.posts.find((post) => post.id === postId)

			if (!post) {
				throw new Error('Cannot find Post')
			}

			return pubsub.asyncIterator(`comment ${postId}`)
		}
	},
	post: {
		subscribe(parent, args, { pubsub }, info) {
			return pubsub.asyncIterator('post')
		}
	}
}

export { Subscription as default }