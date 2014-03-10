// make some sphere or something
// make some cylinders and two invisible planes
//
// magical physics happens here
//
// ???
//
// profit!

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 100000);
// FOV, aspect ratio, near clipping plane, far clipping plane

camera.position.z = 50;
controls = new THREE.OrbitControls(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xccbbcc, 1);
//no idea what that 1 is

document.body.appendChild(renderer.domElement);
var yScale = 1;
var xScale = 1;
var pegsGeom = new THREE.CylinderGeometry(.1, .1, 1, 8);
var pegMaterial = new THREE.MeshBasicMaterial( {color: 0x111111} );
var ballGeom = new THREE.SphereGeometry(.4, 16, 16);
var ballMaterial = new THREE.MeshBasicMaterial( {color: 0x333333} );
var shiftedRight = true;
var pegRows = 30;
var pegCols = 12;
var pegs = [];
var pegPositions = [];

for (var i = 0; i < pegRows; i++) {
  shiftedRight = !shiftedRight;
  for (var j = 0; j < pegCols; j++) {
    var peg = new THREE.Mesh(pegsGeom, pegMaterial);
    peg.position.y = (i-pegRows/2)*yScale;
    peg.position.x = (j+(shiftedRight-.5-pegCols)/2)*xScale;
    peg.rotation.x = Math.PI/2;
    scene.add(peg);
    pegs[i+j*pegRows] = peg;
    pegPositions[i+j*pegRows] = new THREE.Vector2(peg.position.x, peg.position.y); 
  }
}

var movers = [];

var sphere = new THREE.Mesh(ballGeom, ballMaterial);
sphere.velocity = new THREE.Vector2(0.01, 0.01);
movers.push(sphere);
// click, make a ball!
scene.add(sphere);
//
function tryMove(mover) {
  mover.position.x += mover.velocity.x;
  mover.position.y += mover.velocity.y;
}

function physics(movers) {
  for (move in movers) {
    tryMove(movers[move]);

  }  
}

function checkCollisions(object, targets) {
  // given two vectors, one can create a parametrized distance function between them
  // deterministic 
}  


function render() {
  physics(movers);
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();

