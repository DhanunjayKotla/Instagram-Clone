$(document).ready(function () {
    if (chat.latestmsg === undefined) {
        $('.chatscontainer').empty()
        if (chat.isgroupchat === false) {
            $('.chatscontainer').append(`<div class="user">
                                            <div class="prof"><img src='${chat.users[0].profilePic}' alt=""></div>
                                            <div>
                                                <div class="pagename">${chat.users[0].username}</div>
                                                <div class="username"></div>
                                            </div>
                                        </div>`);
        } else {
            var usernames = chat.users.map(user => user.username)
            usernames = usernames.join(', ');
            $('.chatscontainer').append(`<div class="user">
                                            <div class="prof grpprof grpprof1"><img src='${chat.users[0].profilePic}' alt=""></div>
                                            <div class="prof grpprof grpprof2"><img src='${chat.users[1].profilePic}' alt=""></div>
                                            <div>
                                                <div class="pagename">${usernames}</div>
                                                <div class="username">@nonymous</div>
                                            </div>
                                        </div>`);
        }
    }

    $.get('/api/message', { chatid: chat._id }, async result => {
        var index = 0
        for (const msg of result) {
            await displaymsg(msg, result[index + 1])
            index++;
        }
        scrolltobottom(true)
    })
})

$('.msgsendbtn').click(function () {
    submitmsg()
})

function submitmsg() {
    var msg = $('.msginput').val().trim();
    $('.msginput').val('').keydown()
    var chatid = $('.msginput').parents('.bottom').data('chatid')
    if (msg !== '') {
        $.post('/api/message', { content: msg, chatid: chatid }, result => {
            displaymsg(result)
            scrolltobottom(true);
            socket.emit('msg', result)
            // updatelastmessage(result)
        })
    }
}

async function displaymsg(msg, nextmsg) {

    var ismine, img, nextmsgsenderid, content;
    if (nextmsg)
        nextmsgsenderid = nextmsg.sender._id

    if (msg.sender._id === userloggedin._id) {
        ismine = msg.post === true ? 'minepost' : 'mine';
        img = '';
    } else {
        ismine = '';
        img = msg.sender._id === nextmsgsenderid ? '' : `<img src='${msg.sender.profilePic}'>`
    }

    if (msg.post === true) {
        var post = await $.get('/api/post', { postid: msg.content })
        content = `<div class="msgpost ${ismine}" data-postid=${post._id}><img src='${post.postPic}' alt=""></div>`
    } else {
        content = `<div class="msg ${ismine}">${msg.content}</div>`
    }

    $('.msgsholder').append(`<div class="msgcon">
                                <div class="prof">${img}</div>
                                ${content}
                            </div>`)

}

function scrolltobottom(animation) {
    const container = $('.middle');
    const scrollheight = container.prop("scrollHeight");

    if (animation) {
        container.animate({ scrollTop: scrollheight }, 'slow');
    } else {
        container.scrollTop(scrollheight);
    }
}
