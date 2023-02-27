const express = require('express')

const hostname = "0.0.0.0";
const port = 3000;

const server = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://mongo/apinode");

server.use(express.urlencoded());
server.use(express.json());

const postRoute = require("./api/routes/postRoute");
const commentRoute = require("./api/routes/commentRoute");

postRoute(server);
commentRoute(server);

server.listen(port, hostname, () => {
    console.log(`Serveur qui tourne sur le port ${port}`);
});