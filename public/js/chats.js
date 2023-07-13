$(document).ready(async function () {
    const chats = await $.get('/api/chat');

    chats.forEach(chat => {
        const html = createchathtml(chat);
        const element = $(html);
        element.click(function () {
            window.location.href = `/direct/t/${chat._id}`
        })
        $('.chatscontainer').append(element);
    })

})

function createchathtml(chat) {

    var latestmsg = '';
    if (chat.latestmsg) {
        if (chat.latestmsg.sender._id === userloggedin._id) {
            latestmsg = chat.latestmsg.post === true ? 'Sent an attachment' : `You: ${chat.latestmsg.content}`
        } else {
            latestmsg = chat.latestmsg.post === true ? 'Received an attachment' : `${chat.latestmsg.sender.username}: ${chat.latestmsg.content}`
        }
    }

    if (chat.isgroupchat === false) {
        var user = chat.users.filter(user => user._id !== userloggedin._id)
        return `<div class="user">
                    <div class="prof"><img src='${user[0].profilePic}' alt=""></div>
                    <div>
                        <div class="pagename">${user[0].username}</div>
                        <div class="username">${latestmsg}</div>
                    </div>
                </div>`
    } else {
        var users = chat.users.filter(user => user._id != userloggedin._id)
        var usernames = users.map(user => user.username)
        usernames = usernames.join(', ');
        return `<div class="user">
                    <div class="prof grpprof grpprof1"><img src='${chat.users[0].profilePic}' alt=""></div>
                    <div class="prof grpprof grpprof2"><img src='${chat.users[1].profilePic}' alt=""></div>
                    <div>
                        <div class="pagename">${usernames}</div>
                        <div class="username">${latestmsg}</div>
                    </div>
                </div>`
    }
}
