const express = require('express')

const hostname = "0.0.0.0";
const port = 3000;

const server = express();

server.get("/", (req,res)=>{
    res.type('html');
    res.status(200);
    res.end("Home");
});

server.get("/posts", (req,res)=>{
    res.type('html');
    res.status(200);
    res.end("Liste des articles");
});

server.listen(port, hostname, () => {
    console.log(`Serveur qui tourne sur le port ${port}`);
});