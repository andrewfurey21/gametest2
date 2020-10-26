function updatePellets(){
  //could try when shooting send rather then always send empty array
  //adds pellet to array
  if (buttons.left && reload && pelletsLeft >= 1){
    reload = false;
    pelletsLeft--;
    let pelletNum = pelletNums[pelletIndex++ % pelletNums.length];

    const p = new Pellet(player.center.x, player.center.y, m.x, m.y, player.col, PLAYER_ID, true, pelletNum);
    pellets.push(p);
    // console.log(p);
    const data = {
      x: p.pos.x,
      y: p.pos.y,
      mx: p.next.x,
      my: p.next.y,
      col: p.col,
      pelletNum: pelletNum,
      id: PLAYER_ID
    }
    socket.emit('newPellet', data);
  }

  //draws, deletes and updates pellets
  if (pellets.length > 0){
    for (let i = pellets.length - 1; i >= 0; i--){

      if (circleOnScreen(pellets[i].x, pellets[i].y, pellets[i].r, player)){
        pellets[i].show();
      }
      pellets[i].update();

      const p = pellets[i];
      if (dist(p.origin.x, p.origin.y, p.pos.x, p.pos.y) > p.distance){
        pellets.splice(i, 1);
      }
    }
  }
}

function pelletHit(players, pellets, player, blobs){
  if (pellets.length > 0){
    for (let i = 0; i < players.length; i++){
      for (let j = pellets.length - 1; j >= 0 ; j--){
        if (dist(pellets[j].pos.x, pellets[j].pos.y, players[i].x, players[i].y) <= pellets[j].r + players[i].w / 2 && pellets[j].id != players[i].gameId){
          if (players[i].gameId != PLAYER_ID){
            pellets.splice(j, 1);
          } else {
            player.health -= pellets[j].damage;
            pellets.splice(j, 1);
          }
        }
      }
    }
  }


  if (pellets.length > 0){
    for (let i = 0; i < blobs.length; i++){
      for (let j = pellets.length - 1; j >= 0 ; j--){
        if (dist(pellets[j].pos.x, pellets[j].pos.y, blobs[i].x, blobs[i].y) <= pellets[j].r + blobs[i].r && pellets[j].id != blobs[i].id){
          blobs[i].r -= pellets[i].damage * .5;
          pellets.splice(j, 1);
        }
      }
    }
  }
}

function shootPellets() {
  if (reload_count > reload_speed){
    reload_count = 0;
    reload = true;
  }
  reload_count++;

  if (!buttons.left){
    pelletsLeft += pelletReloadRate;
  }

  if (pellets.length > 0){
    pelletHit(players, pellets, player, blobs);
  }

  if (pelletsLeft > pelletMax){
    pelletsLeft = pelletMax;
  }
}
