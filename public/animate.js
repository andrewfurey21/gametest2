const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*';
const PLAYER_ID = initPlayerId(letters, 10);
const maxD = 1750;

const soundeffects = ['sounds/Deez Nuts Sound Effect.mp3',
    'sounds/GET NOSCOPED Sound effect.mp3',
    'sounds/Gotcha bitch Sound Effect.mp3',
    'sounds/Hyper Distorted Sad Violin Sound Effect.mp3',
    'sounds/I Dont Give A Fuck Sound Effect.mp3',
    'sounds/Oh Baby A Triple Sound Effect.mp3',
    'sounds/SHOTS FIRED SOUND EFFECT.mp3',
    'sounds/That Was Legitness Sound Effect.mp3',
    'sounds/This Is Sparta Sound Effect.mp3',
    'sounds/Watch Your Profanity Sound Effect.mp3'
];

// let s = new Sound(soundeffects[0]);
// s.play();

document.getElementById("username").value = 'Player';
let user = document.getElementById("username").value;





//Diameter of the player
let player_size = 40;
//Speed of the player
let player_velocity = 5;

//Variables used to control direction of the player when keys are pressed
let xdir = 0;
let ydir = 0;





const collist = ['#51db5f', '#e00000', '#02cce3', '#7f4ed4', '#ffc400', '#cfcfcf'];
const col2list = ['#117330', '#940000', '#008c9c', '#433261', '#99780c', '#2b2a2a'];

const index = Math.floor(Math.random() * collist.length)
const col = collist[index];
const col2 = col2list[index];

let newx = Math.random() * (maxD - 200) * Math.cos(Math.random() * 360);
let newy = Math.random() * (maxD - 200) * Math.sin(Math.random() * 360);

// let newx = 0;
// let newy = 0;

//Player
const player = new Player(newx, newy, player_size, player_velocity, col, col2, PLAYER_ID, user);
//Array of objects of other players
let players = [];

// 245, 216, 174
const clearColor = '#f5ebdc';

//Array of pellets that are recorded. This may be sent to other players for them to draw those bullets as well
let pellets = [];
let pelletNums = [];
let pelletIndex = 0;
//could use map
for (let i = 0; i < 100; i++) {
    pelletNums.push(i);
}

//Reload and shooting variables for the pellets
let reload_speed = 5;
let reload = true;
let reload_count = 0;

let pelletsLeft = 50;
const pelletReloadRate = .05; //.5 every frame does pellets left increase
const pelletMax = 50;

//array of blobs
let blobs = [];
let blob_radius = 200;

const blobMax = 3;
let blobAmount = blobMax;
const blobReloadIncrement = .00025;
let canSpawnBlob = true;

let hill;

let pups = [];


// console.log(Math.cos(radians(0)))
socket.emit('start', player);

socket.on('heartbeat', (data) => {
    //could be improved for faster times possibly how?
    players = [];
    if (data.entities.length > 0) {
        for (let i = 0; i < data.entities.length; i++) {
            const p = data.entities[i];
            players.push(p);
        }
    }
    hill = { x: data.hill.x, y: data.hill.y, r: data.hill.r }
        // console.log(players[0].user);
});

socket.on('initnewpup', (data) => {
    pups.push(new PowerUps(data.x, data.y));
});

socket.on('initNewPellet', (data) => {
    pellets.push(new Pellet(data.x, data.y, data.mx, data.my, data.col, data.id, false, data.pelletNum));
});

socket.on('initNewBlob', (data) => {
    //will also need a number probably
    blobs.push(new Blob(data.x, data.y, data.r, data.col, data.id));
});



animate();

function animate() {

    user = document.getElementById("username").value;

    // console.log(otherPellets);
    requestAnimationFrame(animate);
    resize(canv);
    //Always resets the canvas back to 0, 0
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(canv.width / 2, canv.height / 2);
    ctx.translate(-player.x, -player.y);



    clear('grey', player);
    circle(0, 0, maxD, clearColor);
    circleNoFill(0, 0, maxD, 'black');



    if (dist(0, 0, player.x + player.w / 2, player.y + player.w / 2) > maxD) {
        player.health = 0.1;
    }
    if (dist(hill.x, hill.y, player.x, player.y) < hill.r) {
        player.points += .1;
    }

    circle(hill.x, hill.y, hill.r, 'orange');

    //function that updates, draws and deletes pellets from array
    updatePellets();

    // logic for movement
    xdir = Keys.left ? -1 : Keys.right ? 1 : 0;
    ydir = Keys.down ? 1 : Keys.up ? -1 : 0;

    //drawings for perspective
    drawImage(playerImg, -10, 300, 100, 100);
    circle(200, 0, 100, 'red');

    spawnBlob(player.x, player.y, blob_radius, player.col, PLAYER_ID);

    //showing all players before the actual player
    if (players.length > 0) {
        for (let i = 0; i < players.length; i++) {
            if (players[i].id != socket.id) {
                // console.log(players[i].w);
                if (circleOnScreen(players[i].x, players[i].y, players[i].w / 2, player) && !players[i].inside) {
                    // circle(players[i].x, players[i].y, players[i].w/2, players[i].col);
                    const p = players[i];
                    drawOther(p);
                }
            }
        }
    }

    if (pups.length >= 1) {
        for (let i = pups.length - 1; i >= 0; i--) {
            pups[i].show();
            if (pups[i].counter > 1000) {
                pups.splice(i, 1);
            }
            if (dist(pups[i].x, pups[i].y, player.x, player.y) < pups[i].r) {
                console.log('POWER')
                pups[i].givePower(player);
                pups.splice(i, 1);
            }

        }
    }

    //player functions
    player.show(blobs, pelletsLeft, blobAmount, pelletMax, blobMax);

    player.move(xdir, ydir);

    //positions used for shooting and cross-hair
    mx = mouse.x - canv.width / 2 + player.x - 3;
    my = mouse.y - canv.height / 2 + player.y - 3;

    //drawing the cross at mouse x and y
    ctx.translate(player.center.x, player.center.y);
    drawCross(mx - player.x, my - player.y, 'black');
    ctx.translate(-player.center.x, -player.center.y);

    //variables to use for the vector
    m = new Vector(mx, my);

    m.sub(player.center);
    m.normalize();
    m.mult(10);

    if (player.health < 1) {
        let s = new Sound(soundeffects[Math.floor(Math.random() * soundeffects.length)]);
        s.play();
        player.x = Math.random() * (maxD - 200) * Math.cos(Math.random() * 360);
        player.y = Math.random() * (maxD - 200) * Math.sin(Math.random() * 360);
        player.health = player.maxhealth;
        player.points -= 100;

        if (player.points < 0) player.points = 0;
    }

    player.user = user;

    displayPoints(player, players);

    //could do with some refactoring
    //once count reaches the reload speed, count is reset and if the left button is pressed, a new pellet is added to the array
    shootPellets();
    manageBlobSpawn();

    const package = {
        player: player
            // pellets: pellets
    }

    //add when player hasnt moved it doesnt update package
    socket.emit('updatePackage', package);
}