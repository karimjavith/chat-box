var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var fs = require("fs");

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
  socket.on("chat message", function(msg) {
    // console.log("message: " + msg);
    saveData(msg);
  });
});

app.get("/api/chat", (req, res) => {
  fs.readFile("data.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send(data ? data : []);
    }
  });
});
http.listen(3002, function() {
  console.log("listening on *:3002");
});

function saveData(newData) {
  fs.readFile("data.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      var obj = data ? JSON.parse(data) : [];
      obj.push(newData);
      var json = JSON.stringify(obj, null, 2);
      fs.writeFileSync("data.json", json);
    }
  });
}
