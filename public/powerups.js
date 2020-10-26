class PowerUps {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 20;
        this.col = 'green';
        this.counter = 0;
    }

    show() {
        circle(this.x, this.y, this.r, this.col);
        this.counter++;
    }

    givePower(player) {
        let index = Math.floor(Math.random() * 6);
        switch (index) {
            case 0:
                player.speed *= 1.2;
                break;
            case 1:
                player.w = 60;
                break;
            case 2:
                player.w = 5;
                break;
            case 3:
                player.health = 100;
                break;
            case 4:
                player.speed = 2;
                break;
            case 5:
                player.health = 25;
                break

        }
    }
}