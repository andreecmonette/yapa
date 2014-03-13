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
var cylRad = .1;
var sphRad = .3;
var pegsGeom = new THREE.CylinderGeometry(cylRad, cylRad, 1, 8);
var pegMaterial = new THREE.MeshPhongMaterial( {color: 0x212121, ambient: 0x030303, specular: 0x009900, shininess: 30, shading: THREE.SmoothShading } );
var ballGeom = new THREE.SphereGeometry(sphRad, 16, 16);
var ballMaterial = new THREE.MeshPhongMaterial( {color: 0x333333, shading: THREE.SmoothShading} );
var shiftedRight = true;
var pegRows = 30;
var pegCols = 12;
var pegs = [];
var timestepUpdate = new THREE.Vector3(1,0,0)
var delta = 1/60;
var damping = .85;

var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientLight );
var light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( .1, 1, .1 );
scene.add( light );

for (var i = 0; i < pegRows; i++) {
  shiftedRight = !shiftedRight;
  for (var j = 0; j < pegCols; j++) {
    var peg = new THREE.Mesh(pegsGeom, pegMaterial);
    peg.radius = cylRad;
    peg.position.y = (i-pegRows/2)*yScale;
    peg.position.x = (j+(shiftedRight-.5-pegCols)/2)*xScale;
    peg.rotation.x = Math.PI/2;
    scene.add(peg);
    pegs[i+j*pegRows] = peg;
  }
}

var movers = [];


var createSphere = function() {
  var sphere = new THREE.Mesh(ballGeom, ballMaterial);
  sphere.radius = sphRad;
  sphere.position = new THREE.Vector3(Math.random(),15,0);
  sphere.velocity = new THREE.Vector3(0.01,-5,0);
  sphere.acceleration = new THREE.Vector3(0,-8.3,0);
  movers.push(sphere);
  // click, make a ball!
  scene.add(sphere);
  //

}
renderer.domElement.onclick = createSphere;


var tryMove = function(mover) {
  //console.log(mover.motion.elements);
  var tempAcc = mover.acceleration.clone();
  var tempVel = mover.velocity.clone();
  mover.velocity.add(tempAcc.multiplyScalar(delta));
  mover.position.add(tempVel.multiplyScalar(delta)).add(tempAcc.multiplyScalar(.5*delta));
  checkCollisions(mover, movers.concat(pegs));
}
//var collision = 0;
var checkCollisions = function(movobject, targets) {
  for (target in targets) {
    var displacementVector = movobject.position.clone().sub(targets[target].position);
    var excess = movobject.radius + targets[target].radius - displacementVector.length();
    if (excess > 0 && displacementVector.length() >0)  {
      movobject.velocity.reflect(displacementVector.normalize()).multiplyScalar(damping);
      movobject.position.add(displacementVector.setLength(excess));
      targets[target].materials
      //collision = collision + 1;
    }
  }
  //
  
  
  // ^ naive implementation
  // TODO: oct-tree
  // TODO: actual event-based collision detection
  // given two vectors, one can create a parametrized distance function between them
  // deterministic 
}

var physics = function(movers) {
  for (move in movers) {
    tryMove(movers[move]);
  }  
}

var render = function() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  physics(movers);
}

render();

