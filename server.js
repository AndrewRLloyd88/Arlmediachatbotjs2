let express = require('express');
let app = express();

let http = require('http');
let server = http.Server(app);
let messageHistory = [];
let client = [];
let chatbotWeather = "!Chatbot is pulling information from https://www.metaweather.com/9807/";

app.use(express.static('client'));

app.use(express.static('Client'))
app.get('/', (req, res) => res.render('Client/index'))

let io = require('socket.io')(server);

function isQuestion(msg) {
  return msg.match(/!Chatbot/)
}

function askingWeather(msg) {
 return msg.match(/weather/i)
}

function getWeather(callback) {
 let request = require('request');
 request.get("https://www.metaweather.com/api/location/9807/", function (error, response) {
 if (!error && response.statusCode == 200) {
 let data = JSON.parse(response.body);
     callback('Todays weather outside is: ' + data.consolidated_weather[0].weather_state_name + '. ' + " Max Temperature is:" + data.consolidated_weather[0].max_temp + "°C" + " Min Temperature is:" + data.consolidated_weather[0].min_temp + "°C");
 }
 });
};

io.on('connection', function (socket) {
     client.push({id : socket.client.id});
//    console.log(client);
    // I don't understand e?
    let getClientID = client.find(e => (e.id === socket.client.id))
//       console.log("the Client", getClientID)
       if(getClientID){
           socket.emit("update messages", messageHistory);
      }
    
  socket.on('message', function (msg) {
    console.log('Received Message: ', msg);
    if (!isQuestion(msg)){
        io.emit('message', msg);
        messageHistory.push(msg);
    } else if (askingWeather(msg)) {
        getWeather(function(weather){
        io.emit('message', weather);
        messageHistory.push(weather);
        io.emit('message', chatbotWeather);
        messageHistory.push(chatbotWeather);
        });
    }; 
  });
});

let port = process.env.PORT;
server.listen(port, function() {
  console.log('Chat server running');
});