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
var timestepUpdate = new THREE.Vector3(1,0,0)
var delta = 1/60;

for (var i = 0; i < pegRows; i++) {
  shiftedRight = !shiftedRight;
  for (var j = 0; j < pegCols; j++) {
    var peg = new THREE.Mesh(pegsGeom, pegMaterial);
    peg.radius = .1;
    peg.position.y = (i-pegRows/2)*yScale;
    peg.position.x = (j+(shiftedRight-.5-pegCols)/2)*xScale;
    peg.rotation.x = Math.PI/2;
    scene.add(peg);
    pegs[i+j*pegRows] = peg;
    pegPositions[i+j*pegRows] = new THREE.Vector2(peg.position.x, peg.position.y); 
  }
}

var updateMatrix = new THREE.Matrix4(1,     0,     0,     0,
                                     delta, 1,     0,     0,
                                     0,     delta, 1,     0,
                                     0,     0,     0,     1);
var movers = [];

var physicsSphere = function(material,radius) {
  var thisSphere = new THREE.Mesh(radius, 12, 12);
  thisSphere.radius = radius;
}

var sphere = new THREE.Mesh(ballGeom, ballMaterial);

                                  -5,  3,  -5,   0,
                                  0,   0,   0,   0,
                                  0,   0,   0,   1);
movers.push(sphere);
// click, make a ball!
scene.add(sphere);
//
console.log(sphere.motion.multiply(updateMatrix));
var tryMove = function(mover) {
  //console.log(mover.motion.elements);
  mover.position.set(mover.motion.elements[0], mover.motion.elements[1], mover.motion.elements[2]);
  mover.motion.multiply(updateMatrix);
}

var physics = function(movers) {
  for (move in movers) {
    tryMove(movers[move]);
  }  
}

var checkCollisions = function(object, targets) {
  for (target in targets) {
    if (Math.pow(object.radius + targets[target].radius, 2) < object.position.distanceToSquared(targets[target].position)) {
      var normalForce = new THREE.Vector3(0,0,0);
      normalForce.subVectors(object.position, targets[target].position).normalize();
      var oldVelo = new THREE.Vector3(object.motion.elements[4], object.motion.elements[5], objects.motion.elements[6]);
      oldVelo.
    }
  }
  // ^ naive implementation
  // TODO: oct-tree
  // TODO: actual event-based collision detection
  // given two vectors, one can create a parametrized distance function between them
  // deterministic 
}  


var render = function() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  physics(movers);
}

render();

