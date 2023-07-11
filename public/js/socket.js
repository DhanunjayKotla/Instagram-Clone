var socket = io()

socket.emit('setup', userloggedin)
socket.on('connected', () => {
    console.log('connected to rgv')
})

socket.on('msg', msg => {
    messagerecieved(msg);
})

socket.on('follow', username => {
    displaynotification(username, 'follow');
})

socket.on('like', username => {
    displaynotification(username, 'like');
})
