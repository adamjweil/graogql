
const users = [{
    id: "1",
    name: "Adam",
    age: 23,
    email: "adam@adam.com"
}, {
    id: "3",
    name: "Matt",
    age: 33,
    email: "mjw@weil.com"
}, {
    id: "4",
    name: "Linkz",
    age: 27,
    email: "lbw@weil.com"
}];

const posts = [{
    id: "1",
    title: "Title-1",
    body: "Body or 1",
    published: true,
    author: '1',
}, {
    id: "3",
    title: "Title-3",
    body: "Body or 3",
    published: true,
    author: '1'
}, {
    id: "4",
    title: "Title-4",
    body: "Body for 4",
    published: true,
    author: '4'
}]

const comments = [{
    id: "1",
    body: "Body or 1",
    author: '1',
    post: '1'
}, {
    id: "3",
    body: "Body or 3",
    author: '1',
    post: '3'
}, {
    id: "4",
    body: "Body for 4",
    author: '1',
    post: '3'
}, {
    id: '2',
    body: 'Body for 2',
    author: '1',
    post: '4'
}]

const db = {
    users, 
    posts,
    comments
}

export { db as default}