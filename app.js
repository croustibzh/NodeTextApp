const express = require("express");
const bodyParser = require("body-parser");
const Nexmo = require("nexmo");
const ejs = require("ejs");
const socketio = require("socket.io");

// Init app
const app = express();

// Template engine setup
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + "/public"));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const nexmo = new Nexmo(
  {
    apiKey: "7e4923fb",
    apiSecret: "eVydBwxSAKLnk6j7",
  },
  { debug: true }
);

// Index route
app.get("/", (req, res) => {
  res.render("index");
});

// Catch form submit
app.post("/", (req, res) => {
  // res.send(req.body);
  // console.log(req.body);

  const number = req.body.number;
  const text = req.body.text;

  nexmo.message.sendSms(
    "15877504075",
    `1${number}`,
    text ,
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
        const data = {
          id: responseData.messages[0]['message-id'],
          number: responseData.messages[0]['to']
        }
      io.emit('SMSdata',data);
      }
    }
  );
})


// Define port
const port = 3000;

// Start server
const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
);

//Connect socket
const io = socketio(server);
io.on('connection', (socket)=>{
  console.log('Connected to the socket ');
  io.on('disconnect', ()=>{
    console.log('Disconnected');
  })
})
