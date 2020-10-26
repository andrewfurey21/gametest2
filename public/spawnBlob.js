//function for spawning blob
function spawnBlob(x, y, r, col, id) {
  //adds blob to array
  if (buttons.right && canSpawnBlob && blobAmount >= 1){
    canSpawnBlob = false;
    blobs.push(new Blob(x, y, r, col, id));
    blobAmount--;
    const data = {
      x: x,
      y: y,
      r: r,
      col: col,
      id: id
    }
    socket.emit('newBlob', data);
  }

  //renders blob
  if (blobs.length > 0){
    for (let i = blobs.length - 1; i >= 0; i--){
      if (circleOnScreen(blobs[i].x, blobs[i].y, blobs[i].r, player)){
        blobs[i].show();
      }
      blobs[i].update();

      if (blobs[i].r < .5){
        blobs.splice(i, 1);
      }
    }
  }
}

function manageBlobSpawn() {
  blobAmount += blobReloadIncrement;

  if (blobAmount >= blobMax){
    blobAmount = blobMax;
  }
  if (!buttons.right){
    canSpawnBlob = true;
  }
}
