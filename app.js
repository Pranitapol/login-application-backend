const bodyParser = require("body-parser");
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
// cluster0-shard-00-01.my37m.mongodb.net:27017
// mongodb+srv://Myuser:user123@cluster0.my37m.mongodb.net/
mongoose.connect(process.env.MongoDB_Atlas_URL).then(() => {
  console.log("server is running..");
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("connected to database");
});
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());
const signupRouter = require("./routes/signupRoutes");
server.use("/", signupRouter);

server.listen(8000, () => {
  console.log("listening to port 8000");
});
