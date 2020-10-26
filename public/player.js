//add recoil
class Player {
    constructor(x, y, w, vel, col, col2, id, user) {
        this.w = w - 1;
        this.x = x;
        this.y = y;
        this.speed = vel;
        this.cx = this.x + this.w / 2;
        this.cy = this.y + this.w / 2;
        this.col = col;
        this.col2 = col2;
        this.gameId = id;
        this.inside = false;
        this.maxhealth = 100;
        this.health = this.maxhealth;
        this.currentHealth = this.health;
        this.user = user;
        this.points = 0;
    }

    show(blobs, pelletsLeft, blobAmount, pelletMax, blobMax) {
        this.center = new Vector(this.x, this.y);
        if (blobs.length > 0) {
            for (let b of blobs) {
                if (this.gameId == b.id) {
                    if (dist(b.x, b.y, this.x, this.y) <= b.r - this.w / 2) {
                        this.inside = true;
                        // console.log('Im inside my own blob');
                    } else {
                        this.inside = false;
                    }
                }
            }
        }

        const yPos = this.y - canv.height / 2 + 1;
        const h = 20;
        circle(this.x, this.y, this.w / 2, this.col);
        ctx.strokeStyle = this.col2;

        ctx.beginPath();
        ctx.lineWidth = 5;
        this.currentHealth = lerp(this.currentHealth, this.health, .2);
        const healthAngle = -map(this.currentHealth, 0, this.maxhealth, Math.PI * -1.5, Math.PI / 2);
        ctx.arc(this.x, this.y, this.w / 2 - 2.5, healthAngle, Math.PI * 1.5);
        ctx.stroke();
        ctx.closePath();

        //pellet reload bar
        ctx.beginPath();
        ctx.fillStyle = this.col;
        ctx.fillRect(this.x - canv.width / 2 + 1, yPos, map(pelletsLeft, 0, pelletMax, 0, canv.width / 2 - 1), h);
        ctx.closePath();
        line((this.x - canv.width / 2 + 1) + map(pelletsLeft, 0, pelletMax, 0, canv.width / 2 - 1), yPos, (this.x - canv.width / 2 + 1) + map(pelletsLeft, 0, pelletMax, 0, canv.width / 2 - 1), yPos + h);

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x - canv.width / 2 + 1, yPos, canv.width / 2 - 1, h);
        ctx.closePath();

        //blob reload bar
        ctx.beginPath();
        ctx.fillStyle = this.col2;
        ctx.fillRect(this.x + canv.width / 2 - 1, yPos, 1 - map(blobAmount, 0, blobMax, 0, canv.width / 2), h);
        ctx.closePath();

        line((this.x + canv.width / 2 - 1) + 1 - map(blobAmount, 0, blobMax, 0, canv.width / 2), yPos, (this.x + canv.width / 2 - 1) + 1 - map(blobAmount, 0, blobMax, 0, canv.width / 2), yPos + h);

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        for (let i = 0; i < blobMax; i++) {
            ctx.strokeRect(this.x + (i * (canv.width / 2 / blobMax)) - (1 / blobMax * 2), yPos, canv.width / 3, h);
        }
        ctx.closePath();



        //
        // rect(this.x - canv.width / 2, this.y - canv.height / 2, map(pelletsLeft, 0, pelletMax, 0, canv.width / 2), 20, this.col);
        // ctx.strokeStyle = 'black';
        // ctx.stroke();
        // //blob reload bar
        // rect(this.x + canv.width / 2, this.y - canv.height / 2, -map(blobAmount, 0, blobMax, 0, canv.width / 2), 20, this.col2);



    }

    move(xdir, ydir) {
        this.x += xdir * this.speed;
        this.y += ydir * this.speed;
    }
}