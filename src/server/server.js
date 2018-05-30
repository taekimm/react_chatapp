const express = require("express");
const app = express();
const server = require("http").Server(app);
const path = require("path");

// webpack stuff for hot reload
const webpack = require("webpack");
const webpackConfigURL = path.join(__dirname + "/../../webpack.config")
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
var rooms = ['room1', 'room2', 'room3'];

io.on("connection", socket => {
  io.to(socket.id).emit("SOCKET_ID", client.id);

  // client.on("SEND_MESSAGE", data => {
  //   io.emit("RECEIVE_MESSAGE", data);
  // });
});
