var another,onemore,boundary;
var myscene=[],bodies = [],mousePos={x:0,y:0},thishunter;
var mousevector = new Vector2D(mousePos.x,mousePos.y);
var simulationArea = {
    canvas : document.querySelector('canvas'),
    init : function() {
        // this.context = this.canvas.getContext("2d");
        this.context = setupCanvas(this.canvas);
        this.interval = setInterval(update, 20);
        window.addEventListener('keydown', function (e) {
            simulationArea.keys = (simulationArea.keys || []);
            simulationArea.keys[e.keyCode] = (e.type == "keydown");
        });
        window.addEventListener('keyup', function (e) {
            simulationArea.keys[e.keyCode] = (e.type == "keydown");            
        });
        window.addEventListener("keydown", function(e) {
            // space and arrow keys
            if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);
        this.canvas.onmousemove=function(e) {
            mousePos = {x:e.x,y:e.y};
        };
        this.canvas.ontouchmove=function(e) {
            mousePos = {x:e.touches[0].clientX,
                        y:e.touches[0].clientY};
        };
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Launch the simulation
function launch() {
    simulationArea.init();
    boundary = [1,1,simulationArea.canvas.width-1,simulationArea.canvas.height-1];
    simulationSetup(simulationArea);
}

function simulationSetup(simulationArea) {
    // another = new myParticle(100,100,50,10,"red");
    // another.enableBoundary(boundary);
    // onemore = new myParticle(160,160,50,10,"red");
    // onemore.enableBoundary(boundary);
    
    for (let i = 5; i < simulationArea.canvas.width; i+=1000) {
        bodies.push(new myParticle(i,100,50,5,"red").enableBoundary(boundary));
    }
    
    another = bodies[0];
    myswarm = Swarm.createSwarm(200,new Vector2D(200,200),"white",boundary,4,50)
    // myswarm.enableBoundary(boundary);
    thishunter = new followerParticle(100,500,50,10,'yellow',new Vector2D(mousePos.x,mousePos.y)).enableBoundary(boundary);
    // another = thishunter;
    bodies.push(thishunter)
    // bodies.push(...myswarm.collection);
    myscene = combination([...bodies,...myswarm.collection]);
    // myswarm.addHunters([another]);
}
function update() {
    mousevector.x = mousePos.x,mousevector.y = mousePos.y;
    thishunter.addTarget(mousevector);
    myscene.forEach(element => {
        perfectCollition(element[0],element[1]);
    });
    if (simulationArea.keys && simulationArea.keys[37]) {another.applyForce(new Vector2D(-1,0));}
    if (simulationArea.keys && simulationArea.keys[39]) {another.applyForce(new Vector2D(1,0)); }
    if (simulationArea.keys && simulationArea.keys[38]) {another.applyForce(new Vector2D(0,-1));}
    if (simulationArea.keys && simulationArea.keys[40]) {another.applyForce(new Vector2D(0,1));}   
    simulationArea.clear();
    myswarm.addTarget(mousevector);
    thishunter.move().draw();
    myswarm.move().draw();
    bodies.forEach(element => {
        element.move().draw();
    });
    // console.log(mousePos);
}

function setupCanvas(canvas) {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
  }