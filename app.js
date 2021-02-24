const matrixDiv = document.querySelector(".gameMatrix");
const dirtStart = 16;
const dirtTop = dirtStart + 1;


const buildWorld = () => {
  for (let row = 0; row < 25; row++) {
    for (let col = 0; col < 25; col++) {
      let pixel = document.createElement("div");
      pixel.classList.add("pixel");
      if (row == dirtTop) {
        pixel.classList.add("dirtTopBox");
      }
      if (row > dirtStart) {//dirt
        pixel.classList.add("dirtBox");
      }
      pixel.classList.add("sky");
      console.log(matrixDiv);
      matrixDiv.appendChild(pixel);
    }
  }
}
buildWorld();