const matrixDiv = document.querySelector(".gameMatrix");
const dirtStart = 16;
const dirtTop = dirtStart + 1;

let selectedTool;
let selectedTile;

/**
 *  Represent the state of the game:
 *   Remove = 0 . When a tool is selected- we can only remove tiles
 *   Add = 1. When a tile type is selected- we can only add this kind of tile.
 * */
let gameState = {
  remove: 0,
  add: 1,
};
let currentState;
const tools = []; //Holds all type of tools names and id's.
const tiles = [];
// const counters = [];

const resetBtn = document.querySelector(".reset");
resetBtn.addEventListener("click", () => window.location.reload());

const setAllowedTiles = () => {};

/**
 *  Removes the class: className from element. 
 * If element is not provided, search for the document for an element. 
 */
const removeClass = (className, element = null) => {
  if (element) {
    if(element.classList.contains(className)){
      element.classList.remove(className);
    }
  }
  else{
    let s = document.querySelector(`.${className}`);
    if (s) {
      s.classList.remove(className);
    }
  }
};

const setSelectedElement = (type, element) => {
  let name = element.getAttribute("name");
  if (type === "tool") {
    selectedTool = tools.find((tool) => tool.name === name);
  } else if (type == "tile") {
    selectedTile = tiles.find((tile) => tile.name === name);
  }
  element.classList.add("selected");
  console.log("selected:" + name);
  console.log("current state:" + currentState);
};

const clickOnTool = (e) => {
  currentState=gameState.remove;
  removeClass("selected");
  setSelectedElement("tool", e.currentTarget);
  setAllowedTiles(); //TODO setAllowedTiles
};

const clickOnTile = (e) => {
  currentState=gameState.add;
  removeClass("selected");
  setSelectedElement("tile", e.currentTarget);
};

/**
 * 
 * The event listener callback faction for each cell in matrix
 */
function doOnClick(e) {
  console.log(e.currentTarget.dataset);
  if (currentState === gameState.remove) {
    removeTile(e.currentTarget);
  }
  else if (currentState === gameState.add){
    addTile(e.currentTarget);
  }
}

const toolTypes = document.querySelectorAll(".tool");
const createTools = (toolTypes) => {
  toolTypes.forEach((tool, index) => {
    let toolObj = {
      name: tool.getAttribute("name"),
      id: index,
    };
    tools.push(toolObj);
    tool.addEventListener("click", clickOnTool);
  });
};
createTools(toolTypes);

/**
 * Define for tools[] which tile it can remove
 */
const setAllowedToRemove = () => {
  tools.forEach(tool =>{
    switch (tool.name){
      case "axe":
        tool.allow=["treeTop","treeLog"];
        break;
      case "pickaxe":
        tool.allow=["rock"];
        break;
        break;
      case "shovel":
        tool.allow=["dirt","dirtTop"];
        break;
    }
  })
};
setAllowedToRemove();
console.log(tools);

const tileTypes = document.querySelectorAll(".tile");
const createTiles = (tileTypes) => {
  tileTypes.forEach((tile, index) => {
    let tileObj = {
      name: tile.getAttribute("name"),
      id: index,
      count: Number(tile.firstElementChild.innerText),
    };
    tiles.push(tileObj);
    tile.addEventListener("click", clickOnTile);
  });
};
createTiles(tileTypes);
console.log(tiles);

const updateCounter = (type) => {
  currentState === gameState.remove? tiles[type.id].count += 1:
  tiles[type.id].count -= 1;
  document.querySelector(`.${type.name} .counter`).textContent =
    tiles[type.id].count;
};

const removeTile = (tile) => {
  let type = getTileType(tile);
  if (type) {
    //if type is undefined the tile is "sky" and can't br removed
    removeClass(type.name, tile);
    updateCounter(type);
  }
};

const addTile = (tile)=>{
  let type = getTileType(tile); //The type of the tile to add to. Can only add  tiles on "sky"
  if(!type){
    if (tiles[selectedTile.id].count>0){
      tile.classList.add(selectedTile.name);
      updateCounter(selectedTile);
    }
    console.log("tile is sky",tile);
  }
}

const getTileType = (selectedTile) =>
  tiles.find((tile) => selectedTile.classList.contains(tile.name));

const getCell = (col,row)=>{
  let elements = document.querySelector(".pixel");

} 
const buildWorld = () => {
  for (let row = 0; row < 25; row++) {
    for (let col = 0; col < 35; col++) {
      let pixel = document.createElement("div");
      pixel.setAttribute("data-col", col);
      pixel.setAttribute("data-row", row);
      pixel.classList.add("pixel");
      pixel.addEventListener("click", doOnClick);
      if (row == dirtTop) {
        pixel.classList.add("dirtTop");
      } else if (row > dirtStart) {
        pixel.classList.add("dirt");
      }
      matrixDiv.appendChild(pixel);
    }
  }
};
buildWorld();

