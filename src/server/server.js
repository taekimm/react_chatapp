const express = require("express");
const app = express();
const server = require("http").Server(app);
const path = require("path");

app.use(express.static(path.join(__dirname, "/../../public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../../public/index.html"));
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

const io = require("socket.io")(server);

io.on("connection", client => {
  io.to(client.id).emit("SOCKET_ID", client.id);

  client.on("SEND_MESSAGE", data => {
    io.emit("RECEIVE_MESSAGE", data);
  });
});
