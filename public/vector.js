class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vec){
    this.x += vec.x;
    this.y += vec.y;
  }

  sub(vec){
    this.x -= vec.x;
    this.y -= vec.y;
  }

  mult(num){
    this.x *= num;
    this.y *= num;
  }

  div(num){
    this.x /= num;
    this.y /= num;
  }

  normalize() {
    let m = Math.sqrt(this.x * this.x + this.y * this.y);
    this.div(m);
  }
}
