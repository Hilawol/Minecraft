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
let darkMode=false;

const tools = []; //Holds all type of tools names and id's.
const tiles = [];

const darkBtn = document.querySelector(".darkBtn");
const resetBtn = document.querySelector(".reset");

resetBtn.addEventListener("click", () => window.location.reload());
darkBtn.addEventListener("click",changeGameMode);


//------------------------- Utility Functions------------------------------


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
    let selected = document.querySelectorAll(`.${className}`);
    selected.forEach(s=> s.classList.remove(className));
  }
};

/**
 * Adds the class name that matches the id according the tiles array. 
 * if id='x' does not add a class because it is sky
 * @param {x if sky, number if tile} id 
 * @param {an html elemnt} element 
 */
const addClass = (id,element)=> {
  if(id=="s"){
    element.classList.add("sun");
  }
  else if (!(id === 'x')){
   element.classList.add((tiles.find(t => t.id === id)).name);
 }
}

const setSelectedElement = (type, element) => {
  let name = element.getAttribute("name");
  if (type === "tool") {
    selectedTool = tools.find((tool) => tool.name === name);
  } else if (type == "tile") {
    selectedTile = tiles.find((tile) => tile.name === name);
  }
  element.classList.add("selected");
};

const setUnavilableTiles = () => {
   //first removes previous tiles selected as unavailable
  let removeUnavailable = document.querySelectorAll(".unavailable");
  removeUnavailable.forEach(tile => removeClass("unavailable", tile));

  tiles.forEach(tile =>{
   if(!selectedTool.allow.find(t => t === tile.name)){ //if current tile is not allowed by current selected tool make it unavailable
     document.querySelector(`.${tile.name}`).classList.add("unavailable");
   }
  })
};



// ----------------------------------- Game Events ------------------------//

/**
 *  callback faction for click on tool in the tool div
 */
const clickOnTool = (e) => {
  currentState=gameState.remove;
  removeClass("selected");
  setSelectedElement("tool", e.currentTarget);
  setUnavilableTiles(); 
};


/**
 *  callback faction for click on tile in the inventorty div
 */
const clickOnTile = (e) => {
  currentState=gameState.add;
  removeClass("selected");
  removeClass("unavailable"); //to show all inventories
  setSelectedElement("tile", e.currentTarget);
};

/**
 *  callback faction for click on each cell in matrix
 */
function clickOnCell(e) {
  if (currentState === gameState.remove) {
    removeTile(e.currentTarget);
  }
  else if (currentState === gameState.add){
    addTile(e.currentTarget);
  }
}

/**
 * Change between dark/light mode
 */
function changeGameMode(){
  let cells = document.querySelectorAll(".cell");
  if(darkMode){
    removeClass("dark");
    let moon = document.querySelectorAll(".moon");
    moon.forEach(m=>{
      m.classList.remove("moon");
    })
    darkBtn.textContent="Dark Mode";
  }
  else{
    let sun = document.querySelectorAll(".sun");
    sun.forEach(s=>{
      s.classList.add("moon");
    })
    cells.forEach(c=>c.classList.add("dark"));
    darkBtn.textContent="Light Mode";
  }
  darkMode=!darkMode;
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
 * Define the tools[] which tile it can remove
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
      case "shovel":
        tool.allow=["dirt","dirtTop"];
        break;
      case "wind":
        tool.allow=["cloud"]  ;
        break;
    }
  })
};
setAllowedToRemove();

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

const updateCounter = (type) => {
  currentState === gameState.remove? tiles[type.id].count += 1:
  tiles[type.id].count -= 1;
  document.querySelector(`.${type.name} .counter`).textContent =
    tiles[type.id].count;
};

const isAllowed =(tile)=>{
  let unavailables = document.querySelectorAll(".unavailable");
  let allowed = true;
  unavailables.forEach(u =>{
    if (getTileType(u).name=== getTileType(tile).name){
      allowed = false;
    }
  })
  return allowed;
}

const removeTile = (tile) => {
  let type = getTileType(tile);
  if (type){
   if(isAllowed(tile)) {
    //if type is undefined the tile is "sky" and can't br removed
    removeClass(type.name, tile);
    updateCounter(type);
    }
  }
};

const addTile = (tile)=>{
  let type = getTileType(tile); //The type of the tile to add to. Can only add  tiles on "sky"
  if(!type){
    if (tiles[selectedTile.id].count>0){
      tile.classList.add(selectedTile.name);
      updateCounter(selectedTile);
    }
  }
}

const getTileType = (tile) => tiles.find((t) => tile.classList.contains(t.name));
  

const createWorldMatrix = (rows,cols)=>{
  let matrix=[]
  for (let row=0;row<rows;row++){
    let r=[];
    for (let col=0;col<cols;col++){
      if (row === dirtTop) {
        r.push((tiles.find(t=>t.name === "dirtTop")).id)
      }else if (row>dirtTop){
        r.push((tiles.find(t=>t.name === "dirt")).id)
      } else r.push('x');
    }
    matrix.push(r);
  }
  return matrix;
}

const drawWorld=(matrix)=>{
  for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[0].length; col++) {
          let cell = document.createElement("div");
          cell.setAttribute("data-col", col);
          cell.setAttribute("data-row", row);
          cell.classList.add("cell");
          cell.addEventListener("click", clickOnCell);
          addClass(matrix[row][col],cell);
          matrixDiv.appendChild(cell);
        }
  }
}

let stone = [["x","x",2,"x","x"],
             ["x",2,2,2,"x"],
            [2,2,2,2,2]];

let stone2 = [["x",2,2,2,"x"],
           [2,2,2,2,2]];

let tree1 = [["x","x",0,0,"x","x"],
            ["x",0,0,0,0,"x"],
            ["x",0,0,0,0,"x"],
              [0,0,0,0,0,0],
              [0,0,0,0,0,0],
              ["x",0,0,0,0,"x"],
              ["x","x",1,1,"x","x"],
              ["x","x",1,1,"x","x"],
              ["x","x",1,1,"x","x"],
              ["x","x",1,1,"x","x"]];

let tree2 = [["x","x",0,0,"x","x"],
            ["x",0,0,0,0,"x"],
            ["x",0,0,0,0,"x"],
              [0,0,0,0,0,0],
              ["x",0,0,0,0,"x"],
              ["x","x",0,0,"x","x"],
              ["x","x",1,1,"x","x"],
              ["x","x",1,1,"x","x"],];

let cloud1 = [["x","x",5,5,5,5,"x","x"],
             ["x",5,5,5,5,5,5,"x"],
             [5,5,5,5,5,5,5,5],
             ["x","x",5,5,5,5,"x","x"]];

let cloud2 = [["x",5,5,5,5,"x"],
             [5,5,5,5,5,5],
             ["x",5,5,5,5,"x"]];

let sun = [["s","s","s"],
          ["s","s","s"],
          ["s","s","s"]];


const addPaternToWorld=(matrix,pattern,loc)=>{
  for (let row=0;row<pattern.length;row++){
    for (let col=0;col<pattern[0].length;col++){
      matrix[row+loc.row][col+loc.col]=pattern[row][col];
    }
  }
  return matrix;
}
let matrix1  = createWorldMatrix(25,35);

matrix1= addPaternToWorld(matrix1,stone,{row:dirtTop-3, col:5});
matrix1= addPaternToWorld(matrix1,stone2,{row:dirtTop-2, col:28});
matrix1=addPaternToWorld(matrix1,tree1,{row:7,col:12});
matrix1=addPaternToWorld(matrix1,cloud1,{row:2,col:2});
matrix1=addPaternToWorld(matrix1,cloud2,{row:2,col:20});
matrix1=addPaternToWorld(matrix1,sun,{row:1,col:30});
matrix1=addPaternToWorld(matrix1,tree2,{row:9,col:20});
drawWorld(matrix1);
