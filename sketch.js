function removeFromArray(arr, elt) {
    for (var i = arr.length-1; i>=0; i--) {
        if (arr[i] == elt) {
            arr.splice(i,1);
        }
    }
}

function heuristic(a,b) {
    var d = dist(a.i, a.j, b.i, b.j);
    // var d = abs(a.i-b.i) + abs(a.j - b.j);
    return d;
}

var cols = 50;
var rows = 50;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];

var start;
var end;
var path = [];
var w,h;


function setup() {
    createCanvas(400,400)
    console.log('A*');
    w = width / cols;
    h = height / rows;

    for(var i = 0; i<cols;i++){
        grid[i] = new Array(rows);
    }

    for (var i=0; i < cols; i++) { 
        for (var j=0; j < rows; j++) {
            grid[i][j] = new Spot(i,j);
        }
    }
    for (var i=0; i < cols; i++) { 
        for (var j=0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }
    start = grid[0][0];
    end = grid[cols-1][rows-1];
    start.wall = false;
    end.wall = false;


    openSet.push(start);
    
    // console.log(grid);

    

}

function draw() {
    if (openSet.length > 0) {
        //keep going
        var wIndex = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[wIndex].f) {
                wIndex = i;
            }
        }
        var current = openSet[wIndex];
        if (current === end) {
            noLoop();
            console.log("Done");
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        var neighbors = current.neighbors;
        for (var i = 0; i < neighbors.length; i++) {

            var neighbor = neighbors[i];

            if (!closedSet.includes(neighbor) && !neighbor.wall){

                var tempG = current.g + heuristic(neighbor, current);
                var newPath = false;

                if (openSet.includes(neighbor)) {
                    if(tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }
                if (newPath) {
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
                
            }
            
        }

    } else {
        //no solution
        console.log("No solution");
        noLoop();
        return;
    }
    background(255);

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }

    for (var i =0; i < closedSet.length; i++) {
      closedSet[i].show(color(255,0,0,50));
    }
    for (var i =0; i < openSet.length; i++) {
      openSet[i].show(color(0,255,0,50));
    }

    path = [];
    var temp = current;
    path.push(temp);
    while(temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;

    }

    noFill();
    stroke(0,0,100);
    strokeWeight(w/2);
    beginShape();
    for (var i = 0; i<path.length;i++) {
        vertex(path[i].i * w + w / 2, path[i].j * h + h/2);
    }
    endShape();
}
