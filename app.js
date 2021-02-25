const matrixDiv = document.querySelector(".gameMatrix");
const dirtStart = 16;
const dirtTop = dirtStart + 1;

let selectedTool;
let selectedTile;
const tools = []; //Holds all type of tools names and id's.
const tiles = [];

const resetBtn = document.querySelector(".reset");
resetBtn.addEventListener("click", () => window.location.reload());

const setAllowedTiles = () => {

};

const clickOnTool = (e) => {
  if (selectedTool) { //removes the selected class from the previous selected tool
    document.querySelector(`.${selectedTool.name}`).classList.remove("selectedTool");
  }
  selectedTool = tools.find(tool => //sets the new selected tool 
    tool.name === e.currentTarget.getAttribute("name"));
  e.currentTarget.classList.add("selectedTool");
  setAllowedTiles();//TODO setAllowedTiles
};

const clickOnTile = (e)=>{
  debugger
  if (selectedTile) { //removes the selected class from the previous selected tool
    document.querySelector(`.${selectedTile.name}`).classList.remove("selectedTile");
  }
  selectedTile = tiles.find(tile => //sets the new selected tile
    tile.name === e.currentTarget.getAttribute("name"));
    e.currentTarget.classList.add("selectedTile");
}


const toolTypes = document.querySelectorAll(".tool");
const createTools = (toolTypes) => {
  toolTypes.forEach((tool, index) => {
    let toolObj = {
      name: tool.getAttribute("name"),
      id: index,
    }
    tools.push(toolObj);
    tool.addEventListener("click", clickOnTool);
  });
}
createTools(toolTypes);


const tileTypes = document.querySelectorAll(".inventoryBox");
const createTiles = (tileTypes) => {
  tileTypes.forEach((tile, index) => {
    let tileObj = {
      name: tile.getAttribute("name"),
      id: index,
      count: tile.firstElementChild.innerText,
    }
    tiles.push(tileObj);
    tile.addEventListener("click",clickOnTile);
  })
}
createTiles(tileTypes);


function doOnClick(e) {

  console.log(e.currentTarget.dataset);

}

const buildWorld = () => {
  for (let row = 0; row < 25; row++) {
    for (let col = 0; col < 35; col++) {
      let pixel = document.createElement("div");
      pixel.setAttribute("data-col", col);
      pixel.setAttribute("data-row", row)
      pixel.classList.add("pixel");
      pixel.addEventListener("click", doOnClick);
      if (row == dirtTop) {
        pixel.classList.add("dirtTopBox");
      }
      if (row > dirtStart) {//dirt
        pixel.classList.add("dirtBox");
      }
      pixel.classList.add("sky");
      matrixDiv.appendChild(pixel);
    }
  }
}

buildWorld();