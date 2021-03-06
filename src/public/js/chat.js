const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    //new message element
    const $newMessage = $messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight +newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight
   
    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
 //   console.log(newMessageMargin)
}
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

// document.querySelector('#message-form').addEventListener('submit',(e) => {
//     
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //disable
    $messageFormButton.setAttribute('disabled','disabled')
const message = e.target.elements.message.value
    //const message = document.querySelector('input').value
    
    socket.emit('sendMessage',message, (error) => {
     //enable
     $messageFormButton.removeAttribute('disabled')
     $messageFormInput.value = ''  //clears the input
     $messageFormInput.focus() //cursor comes in the input

     if(error) {
            return console.log(error)
        }
        console.log('Message delivered')
    })
})
 $sendLocationButton.addEventListener('click', () => {
     if(!navigator.geolocation) {
         return alert('Geolocation is not supported by your browser')
     }
     $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
 //console.log(position)
 socket.emit('sendLocation', {
     latitude: position.coords.latitude,
     longitude: position.coords.longitude
   }, () => {
       $sendLocationButton.removeAttribute('disabled')
       console.log('Location Shared!')
   })
  })
    })
socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error)
        location.href = '/' //redirects to the same page if user enters already existing username
    }
})
//join is going to accept the username you want to use and the room you are trying to join




// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated!', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })