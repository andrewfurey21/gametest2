
/*
stuff that paint can do:

paint is the same color as the player who spawned it. if the player goes into the paint it hides him
if a player of opposite color enters the paint, he loses health. paint stays there forever but you can paint over it.
*/

class Blob {
  constructor(x, y, r, col, id) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.col = col
    this.loss = .1;
    this.realR = this.r;
    this.id = id;

  }

  show() {
    circle(this.x, this.y, this.realR, this.col);
  }

  update() {
    this.r -= this.loss;
    this.realR  = lerp(this.realR, this.r, .2);
  }
}
