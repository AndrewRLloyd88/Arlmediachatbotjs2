let socket = io();

$("button").on('click', function() {
  let text = $("#message").val();
  let who = $("#initials").val();
  let time = new Date().toLocaleTimeString();
  
  socket.emit('message', time + ": " + who + " says: " + text);
  $('#message').val('');
  return false;
});

//update previously missed messages from the server
socket.on('update messages', function(data){
//    console.log(data);
    let i;
    for (i=0; i<data.length; i++){
 $('<li>').text(data[i]).appendTo('#history');
    }
})


socket.on('message', function (msg) {
  $('<li>').text(msg).appendTo('#history');
});
