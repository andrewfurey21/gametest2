class Pellet {
  constructor(x, y, x1, y1, col, id, checkRandom, pelletNum) {
    //pellets and players need an id to establish where the pellet came from
    //needs a damage based on the pellet
    this.pos = new Vector(x, y);

    if (checkRandom) {
      this.next = new Vector(x1 + random(-.5, .5), y1 + random(-.5, .5));
    } else {
      this.next = new Vector(x1, y1);
    }
    this.origin = new Vector(x, y);


    this.speed = 20;

    this.col = col;

    this.damage = 5;

    this.r = 5;
    this.distance = 1000;

    this.id = id;

    this.pelletNum = pelletNum;

    this.next.normalize();
    this.next.mult(this.speed);
  }

  show() {
    circle(this.pos.x, this.pos.y, this.r, this.col);
  }

  update() {
    this.pos.add(this.next);
  }
}
