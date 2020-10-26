/*

Things to work on:

increase bullet distance, radius, reload
increase blob size, life, reload
increase player speed, health

find useless stuff in code and throw away

*/



const canv = document.getElementById('canvas');
canv.style.cursor = 'none';
const ctx = canv.getContext('2d');
const fullscreen = document.getElementById('fullscreen');

// Connecting to the socket
const socket = io.connect();

// let mx, my, m;

const playerImg = document.getElementById('player');

//no inspect by right click
// document.addEventListener("contextmenu", (e) => {
//     e.preventDefault();
// }, false);

function line(x, y, x1, y1) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
}

//If using a image for the background, remember to make it so that the image clears the current view
//of the canvas, that was the problem with clear();
function drawImage(img, x, y, w, h) {
    ctx.drawImage(img, x, y, w, h);
}

function resize(canvas) {
    // Lookup the size the browser is displaying the canvas.
    let displayWidth = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {

        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

function clear(col, player) {
    ctx.beginPath();
    ctx.fillStyle = col;
    ctx.translate(player.x - canv.width / 2, player.y - canv.height / 2);
    ctx.fillRect(0, 0, canv.width, canv.height)
    ctx.translate(-player.x + canv.width / 2, -player.y + canv.height / 2);
    ctx.closePath();
}
//
// function drawAngledImage(img, x, y, a, w, player){
//      // ctx.setTransform(1, 0, 0, 1, x, y);
//      // ctx.rotate(a);
//      // ctx.drawImage(img, -1 * w / 2, -1 * w / 2, w, w);
//      // //circle(-1 * w / 2, -1 * w / 2, 5, '#FF0000')
//      // ctx.setTransform(1, 0, 0, 1, 0, 0);
//
//      ctx.setTransform(1, 0, 0, 1, x, y);
//
//      ctx.rotate(a);
//      ctx.drawImage(img, -1 * w / 2, -1 * w / 2, w, w);
//      // ctx.setTransform(1, 0, 0, 1, -player.xPos, -player.yPos);
// }

function drawCross(x, y, c) {
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 15, y);
    ctx.lineTo(x + 15, y);
    ctx.moveTo(x, y - 15);
    ctx.lineTo(x, y + 15);
    ctx.stroke();
    ctx.closePath();
}


//once mouse is moved, it mouse.moved will always be true. needs to be fixed
let mouse = {
    x: null,
    y: null
}

document.addEventListener("mousemove", e => {
    let b = canv.getBoundingClientRect();
    mouse.x = e.pageX - b.left;
    mouse.y = e.pageY - b.top;
});



let Keys = {
    up: false,
    down: false,
    left: false,
    right: false,
};

window.onkeydown = e => {
    const kc = e.keyCode;
    // e.preventDefault();
    if (e.keyCode == 65) Keys.left = true;
    if (e.keyCode == 87) Keys.up = true;
    if (e.keyCode == 68) Keys.right = true;
    if (e.keyCode == 83) Keys.down = true;

};

window.onkeyup = e => {
    // console.log('Key Released');
    const kc = e.keyCode;
    // e.preventDefault();

    if (e.keyCode == 65) Keys.left = false;
    if (e.keyCode == 87) Keys.up = false;
    if (e.keyCode == 68) Keys.right = false;
    if (e.keyCode == 83) Keys.down = false;

};

function circleOnScreen(x, y, r, player) {
    // return x + r < 0 && y + r < 0 ? false : x - r > canv.width && y - r > canv.height ? false : true;

    // if (x + r < 0 || y + r < 0 || x - r > canv.width || y - r > canv.height){
    //   return true;
    // } else {
    //   return false;
    // }

    const offY = canv.height / 2;
    const offX = canv.width / 2;
    //
    if (x + r < player.x - offX || y + r < player.y - offY || x - r > player.x + offX || y - r > player.y + offY) {
        return false;
    } else {
        return true;
    }
}

function circleHitsCircle(x, y, r, x1, y1, r1) {
    const d = dist(x, y, x1, y1);
    if (d <= r + r1) {
        return true;
    } else {
        return false;
    }
}

function BubbleSort(arr) {
    let swap = 1;
    while (swap != 0) {
        swap = 0;
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                let temp = arr[i]
                arr[i] = arr[i + 1]
                arr[i + 1] = temp;
                swap++;
            }
        }
    }

}

function displayPoints(player, players) {
    let dv = document.querySelector('div');
    dv.innerHTML = '';
    let pts = [];
    // pts.push({ points: player.points, user: player.user })
    for (let i = 0; i < players.length; i++) {
        pts.push({ points: players[i].points, user: players[i].user });
    }
    pts.sort((a, b) => {
        return a.points - b.points;
    });

    let j = 0;
    let xoff = 0;
    let yoff = 0;
    let amt = 5;
    if (Keys.up) {
        yoff = amt;
    }
    if (Keys.down) {
        yoff = -amt;
    }
    if (Keys.left) {
        xoff = amt;
    }
    if (Keys.right) {
        xoff = -amt;
    }
    for (let i = pts.length - 1; i >= 0; i--) {
        j++;
        text(pts[i].user + ': ' + Math.floor(pts[i].points), player.x + canv.width / 2 - 100 + xoff, player.y - canv.height / 2 + 10 + j * 30 + yoff, 'black');
    }

}



function radians(d) {
    return d * (Math.PI / 180);
}

function degrees(r) {
    return r * (180 / Math.PI);
}

function circle(x, y, r, c) {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function circleNoFill(x, y, r, c) {
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
}

function dist(x1, y1, x2, y2) {
    let a = x2 - x1;
    let b = y2 - y1;
    return Math.sqrt(a * a + b * b);
}



function rect(x, y, w, h, c) {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
    ctx.closePath();
}

function healthBar(player) {
    const w = 50;
    const h = 10;
    //actual health bar
    //needs no stroke
    // player.health = 72;
    ctx.fillStyle = 'green';
    const val = map(player.health, 0, 100, 0, w);
    ctx.fillRect(player.x - w / 2, player.y - player.w * 2, val, h);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(player.x - w / 2, player.y - player.w * 2, w, h);

}

let buttons = {
    left: false,
    middle: false,
    right: false
};

window.onmousedown = e => {
    // e.preventDefault();
    //console.log(e.button)
    if (e.button == 0) buttons.left = true;
    if (e.button == 1) buttons.middle = true;
    if (e.button == 2) buttons.right = true;

}

window.onmouseup = e => {
    // e.preventDefault();
    if (e.button == 0) buttons.left = false;
    if (e.button == 1) buttons.middle = false;
    if (e.button == 2) buttons.right = false;

}

function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function initPlayerId(letters, len) {
    let pos = [];
    let str = '';
    for (let i = 0; i < len; i++) {
        pos.push(Math.floor(Math.random() * letters.length));
    }

    for (let i = 0; i < pos.length; i++) {
        str += letters.charAt(pos[i]);
    }

    return str;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

function text(t, x, y, c) {
    ctx.textAlign = "center";
    let canv = document.getElementById("myCanvas");
    ctx.fillStyle = c;
    ctx.font = "20px Arial";
    ctx.fillText(t, x, y);
}

function drawOther(other) {
    circle(other.x, other.y, other.w / 2, other.col);
    ctx.strokeStyle = other.col2;
    ctx.lineWidth = 5;
    text(other.user, other.x, other.y - 25);
    ctx.beginPath();
    // other.currentHealth = lerp(other.currentHealth, other.health, .09);
    const healthAngle = -map(other.currentHealth, 0, other.maxhealth, Math.PI * -1.5, Math.PI / 2);
    ctx.arc(other.x, other.y, other.w / 2 - 2.5, healthAngle, Math.PI * 1.5);
    ctx.stroke();
    ctx.closePath();
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}