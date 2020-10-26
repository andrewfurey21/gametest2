const express = require('express');
const app = express();
const server = app.listen(5000);

/*
if this is slow, move to system where the player just inits
everything and the server or other player computes everything after that
instead of reseting the array to nothing all the time
*/



app.use(express.static('public'));

console.log("Server is running!");

const socket = require('socket.io');
const io = socket(server);


let players = [];
let blobs = [];

let orbitR = .7 * 1750;
// let hillx = orbitR;
// let hilly = 0;
let angle = 0;
const hillr = 100;
const hillAngleSpeed = .1;
let hill = {
    x: null,
    y: null,
    r: hillr
}







// let newPellets = [];

//Fix so that your not sending the current players positions to itself with broadcast
let counter = 0;
setInterval(() => {
    angle += hillAngleSpeed;
    hill.x = orbitR * Math.cos(angle * Math.PI / 180);
    hill.y = orbitR * Math.sin(angle * Math.PI / 180);
    io.sockets.emit('heartbeat', { entities: players, hill: hill });
    counter += 5;
    if (counter > 1000) {
        x = Math.random() * (1750 - 200) * Math.cos(Math.random() * 360);
        y = Math.random() * (1750 - 200) * Math.sin(Math.random() * 360);
        io.sockets.emit('initnewpup', { x: x, y: y });
        counter = 0;
    }
}, 50);
// const nsp = io.of('/my-namespace');
// nsp.on('connection', (socket) => {
io.sockets.on('connection', (socket) => {
    console.log("New Connection, ID: ", socket.id);

    socket.on('start', (data) => {
        console.log(data.user);
        players.push({
            x: data.x,
            y: data.y,
            w: data.w,
            user: data.user,
            currentHealth: data.currentHealth,
            maxhealth: data.maxhealth,
            col: data.col,
            col2: data.col2,
            inside: data.inside,
            id: socket.id,
            gameId: data.gameId,
            points: data.points
        });
    });

    socket.on('updatePackage', (data) => {
        //look up some good way of searching for items in a list
        // console.log(pellets);
        for (let i = 0; i < players.length; i++) {

            if (socket.id == players[i].id) {
                players[i].x = data.player.x;
                players[i].y = data.player.y;
                players[i].w = data.player.w;
                players[i].currentHealth = data.player.currentHealth;
                players[i].inside = data.player.inside;
                players[i].user = data.player.user;
                players[i].points = data.player.points;

            }
        }
    });

    socket.on('newPellet', (data) => {
        socket.broadcast.emit('initNewPellet', data);
    });

    // socket.on('pelletHit', (data) => {
    //     for (let i = 0; i < pellets.length; i++){
    //       if (data.id == pellets[i].id && data.pelletNum == pellets[i].pelletNum){
    //         pellets.splice(i, 1);
    //       }
    //     }
    //   }
    // );

    socket.on('newBlob', (data) => {
        socket.broadcast.emit('initNewBlob', data);
    });

    socket.on('disconnect', () => {
        console.log("A client has disconnected", socket.id);
        for (let i = players.length - 1; i >= 0; i--) {
            if (players[i].id == socket.id) {
                players.splice(i, 1);
            }
        }
    });
});