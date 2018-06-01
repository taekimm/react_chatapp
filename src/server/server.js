const express = require("express");
const app = express();
const server = require("http").Server(app);
const path = require("path");

// package for zipcode
const zipcodePkg = require("zipcodes");

// webpack stuff for hot reload
const webpack = require("webpack");
const webpackConfigURL = path.join(__dirname + "/../../webpack.config");
const webpackConfig = require(webpackConfigURL);
const compiler = webpack(webpackConfig);

// wepback HMR
app.use(
  require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: false
  })
);

app.use(require("webpack-hot-middleware")(compiler));

// static assets
app.use(express.static(path.join(__dirname, "/../../public")));

// catchall route to send out HTML w/ bundle.js
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../../public/index.html"));
});

// setting up port
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

// socket.IO stuff
const io = require("socket.io")(server);

// vars to hold chatroom data
var usernames = {};
var rooms = [
  {
    name: "General Chat",
    users: []
  }
];

io.on("connection", socket => {
  // send socketID && active rooms to client on init
  io.to(socket.id).emit("SOCKET_ID", socket.id);
  io.to(socket.id).emit("ACTIVE_ROOMS", rooms);

  // find city name by zipcode
  socket.on("FIND_CITY", data => {
    let city = zipcodePkg.lookup(data.zipcode).city;
    let state = zipcodePkg.lookup(data.zipcode).state;
    let locString = `${city}, ${state}`;

    // check if room exists, if not, create && send rooms w/ new room
    if (rooms.filter(obj => obj.name === locString).length == 0) {
      rooms.push({ name: locString, users: [] });
      io.emit("ACTIVE_ROOMS", rooms);
    }
    // send city, state name to client
    io.to(data.socketID).emit("SET_CITY", locString);
  });

  socket.on("JOIN_ROOM", data => {
    usernames[data.userID] = data.userID;
    socket.join(data.roomName);
    socket.emit(
      "UPDATE_CHAT",
      "SERVER",
      `You have connected to ${data.roomName}`
    );
    socket.broadcast
      .to(data.roomName)
      .emit(
        "UPDATE_CHAT",
        "SERVER",
        `${data.username} has connected to this room`
      );
  });

  socket.on("LEAVE_ROOM", data => {
    socket.leave(data.roomName)
    socket.broadcast.
    to(data.roomName)
    .emit(
      "UPDATE_CHAT",
      "SERVER",
      `${data.username} has left this room`
    )
  })

  socket.on("MESSAGE_SENT", data => {
    socket.broadcast
      .to(data.roomName)
      .emit("UPDATE_CHAT", data.username, data.message);
  });
});
