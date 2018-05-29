const express = require("express");
const app = express();
const path = require("path")

app.use("/static", express.static(__dirname + "/../../public"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../../public/index.html"));
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
