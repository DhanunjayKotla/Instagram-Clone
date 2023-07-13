var cropper, timer, srctype;
var selectedusers = [];
var audio = new Audio("/images/NotificationTone.mp3");

$(document).on('click', ".postpop video, .homepost video, .croppostimgpop video", function (e) {
    e.stopPropagation()
    if (this.paused) {
        this.play();
        $(this).siblings('.playbtn').css({ display: 'none' })
    } else {
        this.pause();
        $(this).siblings('.playbtn').css({ display: 'block' })
    }
});

function timeDisplay(createdat) {
    var time = Date.now() - Date.parse(createdat);
    var timedisplay;
    if (time < 60 * 1000) {
        timedisplay = `${Math.floor(time / 1000)}s`
    } else if (time < 60 * 60 * 1000) {
        timedisplay = `${Math.floor(time / (60 * 1000))}m`
    } else if (time < 24 * 60 * 60 * 1000) {
        timedisplay = `${Math.floor(time / (60 * 60 * 1000))}h`
    } else if (time < 7 * 24 * 60 * 60 * 1000) {
        timedisplay = `${Math.floor(time / (24 * 60 * 60 * 1000))}d`
    } else {
        timedisplay = `${Math.floor(time / (7 * 24 * 60 * 60 * 1000))}w`
    }
    return timedisplay;
}

function timeDisplay2(createdat) {
    var time = Date.now() - Date.parse(createdat)
    var timedisplay;
    if (time < 60 * 1000) {
        timedisplay = `${Math.floor(time / 1000)} SECONDS AGO`
    } else if (time < 60 * 60 * 1000) {
        timedisplay = `${Math.floor(time / (60 * 1000))} MINUTES AGO`
    } else if (time < 24 * 60 * 60 * 1000) {
        timedisplay = `${Math.floor(time / (60 * 60 * 1000))} HOURS AGO`
    } else if (time < 7 * 24 * 60 * 60 * 1000) {
        timedisplay = `${Math.floor(time / (24 * 60 * 60 * 1000))} DAYS AGO`
    } else {
        timedisplay = `${Math.floor(time / (7 * 24 * 60 * 60 * 1000))} WEEKS AGO`
    }
    return timedisplay;
}

$('.homepost .morebtn').click(function () {
    $(this).siblings('.posttext').css({ webkitLineClamp: 'unset' })
    this.style.display = 'none';
})

$(document).on('keydown', '.commentinput', function () {
    var el = this;
    var postbtn = $(el).siblings('span');
    setTimeout(function () {
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';

        if (el.value.trim() !== '') {
            postbtn.css({ display: 'block' })
        } else {
            postbtn.css({ display: 'none' })
        }
    }, 0);
})

$('.poppostcontainer').click(function (e) {
    if (!$('.popcontentholder').find('*').is(e.target)) {
        $('.poppostcontainer').toggle()
        selectedusers.length = 0;
    }
})

$('.poppostcontainer1').click(function (e) {
    if (!$('.popcontentholder1').find('*').is(e.target)) {
        $('.poppostcontainer1').toggle()
        selectedusers.length = 0;
    }
})

var sidepopstatus = '';
$('.searchnavbtn').click(function () {
    $('.subcontainer2').empty()
    $('.subcontainer2').append(`<div class="searchhead">
                                    <p>Search</p>
                                    <input type="text" placeholder="Search" class="usersearchinput">
                                </div>
                                <div class="searchrescontainer">
                                    
                                </div>`)
    sidepopstatus !== 'notifications' && $('.sidepop').toggleClass('hidden')
    sidepopstatus = 'search';
})

$('.subcontainer2').on('keydown', '.usersearchinput', function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
        searchingusers($(this).val())
    }, 1000)
})

function searchingusers(value) {
    if (value === '') return $('.searchrescontainer').html('')
    $.get('/api/user', { search: value }, results => {
        appendusers(results)
    })
}

function appendusers(results) {
    $('.searchrescontainer').empty()
    results.forEach(result => {
        if (result._id === userloggedin._id) return
        var html = createuserHtml(result);
        var element = $(html)
        element.click(() => {
            window.location.href = `/${result.username}`
        })
        $('.searchrescontainer').append(element)
    })
}

function createuserHtml(result) {
    return `<div class="user">
                <div class="prof"><img src='${result.profilePic}'></div>
                <div>
                    <div class="pagename">${result.username}</div>
                    <div class="username">${result.name}</div>
                </div>
            </div>`
}

$('.notifnavbtn').click(function () {
    $('.subcontainer2').empty()
    $('.subcontainer2').append(`<div class="notifheader">Notifications</div>
                                <div class="notifcontainer">
                                    <div class="user">
                                        <div class="prof"><img src="/images/rgv.jpeg" alt=""></div>
                                        <div>chaitanya_matina is on instagram. pavan_goluguri and one other follow them. 9w</div>
                                        <div class="bluebtn">Follow</div>
                                    </div>
                                </div>`)
    sidepopstatus !== 'search' && $('.sidepop').toggleClass('hidden')
    sidepopstatus = 'notifications'
})

$(document).click(function (e) {
    if (!$('.sidepop, .sidepop *, .searchnavbtn, .searchnavbtn *, .notifnavbtn, .notifnavbtn *').is(e.target)) {
        $('.sidepop').addClass('hidden');
        sidepopstatus = ''
    }
})

$('.postcreatenavbtn, .createpostbtn2').click(function () {
    $('.popcontentholder').empty();
    $('.popcontentholder').append(`<div class="createpostpop">
                                        <div>Create new post</div>
                                        <div>
                                            <img width="70" height="70" src="https://img.icons8.com/ios/50/image-gallery.png" alt="image-gallery"/><br>
                                            <span>Drag photos and videos here</span> <br>
                                            <input type=file id="postimginput">
                                            <label for="postimginput" class="blue">Select from computer</label>
                                        </div>
                                    </div>`)
    $('.poppostcontainer').show()
})

$('.genderinput').focus(function () {
    $(this).blur();
    $('.popcontentholder').empty();
    $('.popcontentholder').append(`<div class="genderpop">
                                        <div class="heading">Gender</div>
                                        <div class="body">
                                            <input type="radio" name="gender" id="male" value="Male" checked><label for="male">Male</label><br>
                                            <input type="radio" name="gender" id="female" value="Female"><label for="female">Female</label><br>
                                            <input type="radio" name="gender" id="custom" value="Custom"><label for="custom">Custom</label><br>
                                            <input type="radio" name="gender" id="not" value="Prefer not to say"><label for="not">Prefer not to say</label>
                                            <div class="blue submitgenderbtn">Done</div>
                                        </div>
                                    </div>`)
    $('.poppostcontainer').show()
})

$('.popcontentholder').on('click', '.submitgenderbtn', function () {
    $('.genderinput').val($('input[name="gender"]:checked').val());
    $('.poppostcontainer').click();
})

$('#profbtn1, #profbtn2').change(function (e) {

    $('.loading').css({ display: 'flex' })
    var formData = new FormData();
    formData.append("Image", e.target.files[0]);
    $.ajax({
        url: "/api/user/uploadprofile",
        type: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        success: result => {
            $('.userprof img').attr('src', result.profilePic);
            $('.loading').css({ display: 'none' })
        }
    })
})

$('#userdetailssubmitbtn').click(function () {
    $('.userdetailsform').submit()
})

$('.popcontentholder').on('change', '#postimginput', function (e) {

    var src;
    srctype = e.target.files[0]
    if (srctype.type.startsWith('image')) {
        src = '<img src="" class="source">'
    } else if (srctype.type.startsWith('video')) {
        src = `<div class="videocon">
                    <video loop controls class="source"></video>
                    <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/play-button-circled--v1.png" alt="play-button-circled--v1" class="playbtn"/>
                </div>`
    }

    $('.popcontentholder').empty();
    $('.popcontentholder').append(`<div class="croppostimgpop">
                                        <div class="heading">
                                            <span class="back"><img width="27" height="27" src="https://img.icons8.com/ios/50/long-arrow-left.png" alt="long-arrow-left"/></span>
                                            <span class="pophead">Create new post</span>
                                            <span class="bluebtn sharebtn">Share</span>
                                        </div>
                                        <div class="body">
                                            <div class="imgholder">${src}</div>
                                            <div class="captioninputsholder">
                                                <div class="user">
                                                    <div class="prof"><img src='${userloggedin.profilePic}' alt=""></div>
                                                    <div>${userloggedin.username}</div>
                                                </div>
                                                <textarea class="postcaption" placeholder="Write a caption" rows="10"></textarea>
                                                <input type="text" class="postlocation" placeholder="Add a location">
                                                <div>Accessibility</div>
                                                <div>Advanced settings</div>
                                            </div>
                                        </div>
                                        <span class="aspecticon"><i class="fi fi-rr-expand"></i></span>
                                        <div class="aspectcontainer">
                                            <div data-value="NaN">Original <i class="fi fi-rr-picture"></i></div>
                                            <div data-value="1">1:1 <i class="fi fi-rr-square"></i></div>
                                            <div data-value="0.8">4:5 <i class="fi fi-rr-rectangle-vertical"></i></div>
                                            <div data-value="1.77777">16:9 <i class="fi fi-rr-rectangle-horizontal"></i></div>
                                        </div>
                                    </div>`)

    const image = $('.croppostimgpop .imgholder .source');
    image.attr('src', URL.createObjectURL(e.target.files[0]));
    if (srctype.type.startsWith('image')) {
        if (cropper !== undefined) {
            cropper.destroy();
        }
        Cropper.setDefaults();
        cropper = new Cropper(image[0], {
            aspectRatio: 1 / 1,
            background: false,
            autoCropArea: 1,
            zoomable: false
        });
    }
    $('.picuploadpop').toggle()
})

$('.popcontentholder').on('click', '.sharebtn', function () {
    $('.loading').css({ display: 'flex' })
    console.log(srctype);

    var caption = $('.postcaption').val()
    var location = $('.postlocation').val()

    if (srctype.type.startsWith('image')) {
        var canvas = cropper.getCroppedCanvas();
        if (canvas == null) {
            alert("Could not upload image. Make sure it is an image file.");
            return;
        }
        canvas.toBlob((blob) => {
            var formData = new FormData();
            formData.append("caption", caption);
            formData.append("location", location);
            formData.append("croppedImage", blob);
            $.ajax({
                url: "/api/post",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: result => {
                    $('.loading').css({ display: 'none' })
                    window.location.href = `/${userloggedin.username}`
                }
            })
        })
    } else if (srctype.type.startsWith('video')) {
        var formData = new FormData();
        formData.append("caption", caption);
        formData.append("location", location);
        formData.append("croppedImage", srctype);
        $.ajax({
            url: "/api/post",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: result => {
                $('.loading').css({ display: 'none' })
                window.location.href = `/${userloggedin.username}`
            }
        })
    }
})

$('.popcontentholder').on('click', '.aspecticon', function () {
    $('.croppostimgpop .aspectcontainer').toggle();
})

$('.popcontentholder').on('click', '.aspectcontainer div', function () {
    cropper.setAspectRatio($(this).attr('data-value'))
})

$('.explorepost').click(async function () {
    var result = await $.get('/api/post', { postid: $(this).data('postid') })
    displaypostpop(result);
    result = await $.get('/api/comment', { postid: $(this).data('postid') })
    appendcomments(result)
})

$('.homepost .commentscount, .homepost .speech-bubble').click(async function () {
    var result = await $.get('/api/post', { postid: $(this).parents('.homepost').data('postid') })
    displaypostpop(result);
    result = await $.get('/api/comment', { postid: $(this).parents('.homepost').data('postid') })
    appendcomments(result)
})

function displaypostpop(result) {

    var liked = result.likedBy.includes(userloggedin._id) ? 'liked' : '';
    var saved = userloggedin.savedPosts.includes(result._id) ? 'saved' : '';
    var followed = userloggedin.following.includes(result.postedBy._id) ? 'Following' : 'Follow';
    var followb = userloggedin._id === result.postedBy._id ? '' : `<span class="followbtn" data-userid=${result.postedBy._id}>${followed}</span>`

    var src;
    if (result.contentType === 'video') {
        src = `<div class="videocon">
                    <video loop controls src=${result.postPic}></video>
                    <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/play-button-circled--v1.png" alt="play-button-circled--v1" class="playbtn"/>
                </div>`
    } else {
        src = `<img src=${result.postPic} alt="">`
    }

    $('.popcontentholder').empty();
    $('.popcontentholder').append(`<div class="postpop" data-postid=${result._id}>
                                        <div class="postedcontent">${src}</div>
                                        <div class="commentsbox">
                                            <div class="postedby">
                                                <a href='/${result.postedBy.username}'><div class="prof"><img src='${result.postedBy.profilePic}' alt=""></div></a>
                                                <a href='/${result.postedBy.username}'><span class="pagename">${result.postedBy.username}</span></a>&nbsp&nbsp&#8226;&nbsp&nbsp${followb}
                                                <img width="20" height="20" src="https://img.icons8.com/ios-glyphs/30/more.png" alt="more"/>
                                            </div>
                                            <div class="commentscontainer">
                                                <div class="comment posttextbox">
                                                    <a href='/${result.postedBy.username}'><div class="prof"><img src='${result.postedBy.profilePic}' alt=""></div></a>
                                                    <div>
                                                        <div class="posttext"><a href='/${result.postedBy.username}'><span>${result.postedBy.username}</span></a> ${result.caption}</div>
                                                        <div class="commentfooter"><span>${timeDisplay(result.createdAt)}</span><span>Reply</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="postdetails">
                                                <div class="icons">
                                                    <i class="fi fi-rr-heart heart ${liked}"></i>
                                                    <img width="27" height="27" src="https://img.icons8.com/ios/50/speech-bubble--v1.png" alt="speech-bubble--v1"/>
                                                    <img width="27" height="27" src="https://img.icons8.com/ios/50/telegram-app.png" alt="telegram-app" class="share"/>
                                                    <i class="fi fi-rr-bookmark bookmark ${saved}"></i>
                                                </div>
                                                <div class="likescount">${result.likedBy.length} likes</div>
                                                <div class="postedat">${timeDisplay2(result.createdAt)}</div>
                                            </div>
                                            <div class="commentinputbox"><textarea id="" class="commentinput" rows="1" placeholder="Add a comment..."></textarea><span>Post</span></div>
                                        </div>
                                    </div>`)
    $('.poppostcontainer').show()
}

$(document).on('click', '.postpop .commentinput + span', function () {
    // $(this).closest(".postpop").data().postid
    // $(this).parents('.postpop').data('postid')
    $.post('/api/comment', {
        content: $(this).siblings('.commentinput').val(),
        postedBy: userloggedin._id,
        commentTo: $(this).parents('.postpop').data('postid')
    }, result => {
        prependcomment(result);
    })
    $('.commentinput').val('').keydown();
})

$(document).on('click', '.homepost .commentinput + span', function () {
    $.post('/api/comment', {
        content: $(this).siblings('.commentinput').val(),
        postedBy: userloggedin._id,
        commentTo: $(this).parents('.homepost').data('postid')
    }, result => {
        console.log(result)
        // $('.homepost .commentscount').after(`<div class="posttext"><span>${result.postedBy.username}</span>${result.content}</div>`)
        $(this).parent('.commentinputbox').siblings('.commentscount').after(`<div class="posttext"><span>${result.postedBy.username}</span>${result.content}</div>`)
    })
    $('.commentinput').val('').keydown();
})

function appendcomments(results) {
    $('.commentscontainer > *').not('.comment.posttextbox').remove()
    if (results.length === 0) {
        $('.commentscontainer').append('<p class="noc">No comments yet</p>')
    }
    results.forEach(result => {
        var html = createcommenthtml(result);
        var element = $(html)
        $('.commentscontainer').append(element)
    })
}

function prependcomment(result) {
    var html = createcommenthtml(result);
    var element = $(html)
    $('.commentscontainer .posttextbox').after(element)
}

function createcommenthtml(result) {
    return `<div class="comment">
                <a href='/${result.postedBy.username}'><div class="prof"><img src='${result.postedBy.profilePic}' alt=""></div></a>
                <div>
                    <div class="posttext"><a href='/${result.postedBy.username}'><span>${result.postedBy.username}</span></a> ${result.content}</div>
                    <div class="commentfooter"><span>${timeDisplay(result.createdAt)}</span><span>0 likes</span><span>Reply</span></div>
                </div>
                <div class="likebtn"><img width="15" height="15" src="https://img.icons8.com/ios/50/like--v1.png" alt="like--v1"/></div>
            </div>`
}

$('.followbtn').click(function () {
    var userid = $(this).parents('.profilecontainer').data('userid');
    $.ajax({
        url: "/api/user/updatefollowing",
        type: "PUT",
        data: `_METHOD=PUT&userid=${userid}`,
        success: result => {

            var followerstext = parseInt($('.followerscount').text())
            if (result.following && result.following.includes(userid)) {
                $(this).addClass("editbtn");
                $(this).text("Following");
                $('.followerscount').text(followerstext + 1)
                socket.emit('follow', result.username, userid);
            }
            else {
                $(this).removeClass("editbtn");
                $(this).text("Follow");
                $('.followerscount').text(followerstext - 1)
            }

        }
    })
})

$('.followbtn2').click(function () {
    var userid = $(this).parents('.user').data('userid');
    $.ajax({
        url: "/api/user/updatefollowing",
        type: "PUT",
        data: `_METHOD=PUT&userid=${userid}`,
        success: result => {
            location.reload()
        }
    })
})

$(document).on('click', '.postpop .followbtn', function () {
    var userid = $(this).data('userid')
    $.ajax({
        url: "/api/user/updatefollowing",
        type: "PUT",
        data: `_METHOD=PUT&userid=${userid}`,
        success: result => {
            if (result.following.includes(userid))
                $(this).text('Following')
            else
                $(this).text('Follow')
        }
    })
})

$(document).on('click', '.heart', function () {
    var postid = $(this).parents($(this).parents('.homepost').length ? '.homepost' : '.postpop').data('postid');

    $.ajax({
        url: "/api/post/updatelikes",
        type: "PUT",
        data: `postid=${postid}`,
        success: result => {
            console.log(result);
            $(`[data-postid=${result._id}] .heart`).toggleClass('liked');
            $(`[data-postid=${result._id}] .likescount`).text(`${result.likedBy.length} likes`);
            if (result.likedBy.includes(userloggedin._id)) {
                socket.emit('like', userloggedin, result.postedBy)
            }
        }
    })
})

$(document).on('click', '.bookmark', function () {
    var postid = $(this).parents($(this).parents('.homepost').length ? '.homepost' : '.postpop').data('postid');

    $.ajax({
        url: "/api/user/updatesaved",
        type: "PUT",
        data: `postid=${postid}`,
        success: result => {
            console.log(result);
            $(`[data-postid=${postid}] .bookmark`).toggleClass('saved');
        }
    })
})

$(document).on('click', '.share', function () {
    var postid = $(this).parents($(this).parents('.homepost').length ? '.homepost' : '.postpop').data('postid');
    msgsendsharepop('share', '1', postid)
})

$('.msgpopbtn').click(function () {
    msgsendsharepop('send', '')
})

function msgsendsharepop(type, pop, postid) {

    var heading = type === 'share' ? 'Share' : 'New message'
    var btn = type === 'share' ? '<div class="sendbtn blue">Share</div>' : '<div class="chatbtn blue">Chat</div>'

    $('.popcontentholder' + pop).empty();
    $('.popcontentholder' + pop).append(`<div class="msgpop" data-postid=${postid}>
                                        <div class="heading">${heading}</div>
                                        <div class="inputholder">
                                            <div class="label">To:</div>
                                            <div class="labelside">
                                                <input type="text" placeholder="Search..." autofocus>
                                            </div>
                                        </div>
                                        <div class="rescontainer">
                                        </div>
                                        <div class="chatbtncontainer">
                                            ${btn}
                                        </div>
                                    </div>`)
    $('.poppostcontainer' + pop).show();
}

$(document).on('keydown', '.msgpop input', function (event) {
    if ($(this).val() === '' && event.which === 8) {
        selectedusers.pop();
        appendselectedusers();
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
        searchingmsgusers($(this).val())
    }, 1000)
})

function searchingmsgusers(value) {
    if (value === '') return $('.msgpop .rescontainer').html('')
    $.get('/api/user', { search: value }, results => {
        appendmsgusers(results)
    })
}

function appendmsgusers(results) {
    $('.msgpop .rescontainer').empty()
    results = results.filter(x => !(selectedusers.some(y => _.isEqual(x, y))))
    results.forEach(result => {
        if (result._id === userloggedin._id) return
        var html = createmsguserHtml(result);
        var element = $(html)
        element.click(() => {
            selectuser(result);
        })
        $('.msgpop .rescontainer').append(element)
    })
}

function createmsguserHtml(result) {
    return `<div class="user">
                <div class="prof"><img src='${result.profilePic}'></div>
                <div>
                    <div class="pagename">${result.username}</div>
                    <div class="username">${result.name}</div>
                </div>
            </div>`
}

function selectuser(result) {
    selectedusers.push(result)
    appendselectedusers();
    $('.labelside input').val('').keydown().focus();
}

function appendselectedusers() {
    $('.msgpop .selecteduser').remove()
    selectedusers.forEach((result, index) => {
        $('.labelside input').before(`<span class="selecteduser">
                                        <span>${result.username}</span>
                                        <i class="fi fi-rr-cross-small" data-index=${index}></i>
                                    </span>`)
    })
}

$('.popcontentholder').on('click', '.selecteduser i', function () {
    selectedusers.splice($(this).data('index'), 1);
    // appendselectedusers()
})

$('.popcontentholder').on('click', '.chatbtn', function () {
    if (selectedusers.length !== 0) {
        $.post('/api/chat', { users: JSON.stringify(selectedusers) }, result => {
            window.location.href = `/direct/t/${result._id}`
            $('.poppostcontainer').click()
        })
    } else {
        console.log('select something')
    }
})

function messagerecieved(msg) {
    if ($(`[data-chatid="${msg.chat._id}"]`).length == 0) {
        displaynotification(msg, 'msg');
    } else {
        displaymsg(msg);
        scrolltobottom(true)
    }
}

function displaynotification(content, type) {
    var body;
    if (type === 'msg') {
        body = `You got a message from ${content.sender.username}`
    } else if (type === 'follow') {
        body = `${content} started following you`
    } else if (type === 'like') {
        body = `${content} liked your post`
    }

    $('.appcontainer').append(`<div class="notifpopcontainer">
                                    <div class="head">
                                        <img width="30" height="30" src="https://img.icons8.com/color/96/instagram-new--v1.png" alt="instagram-new--v1"/>
                                        <span>INSTAGRAM</span>
                                    </div>
                                    <div class="body">
                                        ${body}
                                    </div>
                                </div>`)
    audio.play();
    setTimeout(() => {
        $('.notifpopcontainer').animate({ opacity: 0 }, 1000)
    }, 2000)

}

$('.showfollowers').click(async function () {
    const result = await $.get('/api/user/followers', { userid: $(this).parents('.profilecontainer').data('userid') })
    showfollowusers(result, 'Followers')
})

$('.showfollowing').click(async function () {
    const result = await $.get('/api/user/following', { userid: $(this).parents('.profilecontainer').data('userid') })
    showfollowusers(result, 'Following')
})

function showfollowusers(result, type) {
    $('.popcontentholder').empty();
    $('.popcontentholder').append(`<div class="followpop">
                                        <div class="heading">${type}</div>
                                        <div class="body"></div>
                                    </div>`)
    $('.poppostcontainer').show();

    var body;
    if (result.length === 0) {
        body = type === 'Followers' ? 'No Followers' : 'No Following'
        $('.followpop .body').append(`<span>${body}</span>`)
        return;
    }

    result.forEach(res => {
        $('.followpop .body').append(`<div class="user">
                                        <div class="prof"><img src='${res.profilePic}' alt=""></div>
                                        <div>
                                            <div class="pagename">${res.username}</div>
                                            <div class="username">${res.name}</div>
                                        </div>
                                    </div>`)
    })
}

$(document).on('click', '.sendbtn', function () {
    $.post('/api/message/postmsg', { content: $(this).parents('.msgpop').data('postid'), selectedusers: JSON.stringify(selectedusers) }, result => {
        $('.poppostcontainer1').click()
        socket.msg('msg')
    })
})

$(document).on('click', '.msgpost', async function () {
    var result = await $.get('/api/post', { postid: $(this).data('postid') })
    displaypostpop(result);
    result = await $.get('/api/comment', { postid: $(this).data('postid') })
    appendcomments(result)
})
