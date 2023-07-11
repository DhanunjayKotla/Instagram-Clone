$(document).ready(async function () {
    const chat = await $.post('/api/chat', { users: JSON.stringify([profuser]) })
    $('.amessage').attr("href", `/direct/t/${chat._id}`)
})
