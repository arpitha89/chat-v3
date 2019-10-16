const users = []

//addUser,removeUser,getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
 //clean the data
 username = username.trim().toLowerCase()
 room = room.trim().toLowerCase()

 //validate the data
if(!username || !room) {
    return {
        error: 'Username and room are required!'
    }
}
//check for existing user
const existingUser = users.find((user) => {
    return user.room === room && user.username === username
})

//validate username
if(existingUser) {
    return {
        error: 'Username is in use!'
    }
}
//store user
const user = { id, username, room }
users.push(user)
return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}









// addUser({
//    id: 22,
//    username: 'Arpitha',
//    room: 'Thane' 
// })

// addUser({
//     id: 42,
//     username: 'Ananya',
//     room: 'Mumbai' 
//  })
 
//  addUser({
//     id: 32,
//     username: 'Arpitha',
//     room: 'Mumbai' 
//  })
// const user = getUser(42)
// console.log(user)
// const userList = getUsersInRoom('Mumbai')
// console.log(userList)

//goal:create two new functions for users
//1. create getUser
    // -accept id and return user Object(or undefined)
//2. create getUsersInRoom
    // -accept room name and return array of users(or empty array)
//3. test your work