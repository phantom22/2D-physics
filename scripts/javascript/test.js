const center = [window.innerWidth / 2, window.innerHeight / 2];

let planets = [];
const numOfPlanets = 300,
      radius = 50,
      mass = 1.5E5,
      slice = Math.PI * 2 / numOfPlanets,
      colors = ["#4FBDBA","#4FBDBA","#35858B"];

let distFromCenter = 500,
    currentColor = 0;

for (let i=0; i<numOfPlanets; i++) {
    const s = slice*i;
    distFromCenter -= 0;
    currentColor++;
    currentColor%=colors.length;
    planets.push(new Planet(
        [center[0]+distFromCenter*Math.cos(s), center[1]+distFromCenter*Math.sin(s)],
        radius,
        mass,
        [Math.cos(s)*20,Math.sin(s)*20],
        colors[currentColor]
    ));
}

planets.push(new Planet(
    [center[0], center[1]],
    400,
    1.5E10,
    [0,0],
    "rgba(30,30,30,0.9)"
))

const system = new SolarSystem("screen", 0.0009, 144, planets);

// const system = new SolarSystem("screen", 0.005, [
//     new Planet(_(center[0] - center[0]/3, center[1] - center[1]/4),
//     20,
//     1E7,
//     _(0,250),
//     "#4FBDBA"),
//     new Planet(_(center[0] + center[0]/3, center[1] - center[1]/4),
//     20,
//     1E7,
//     _(-250,0),
//     "#4FBDBA"),
//     new Planet(_(center[0], center[1]),
//     50,
//     1E6,
//     _(0,0),
//     "#35858B"),
//     new Planet(_(center[0] + center[0]/3, center[1] + center[1]/4),
//     20,
//     1E7,
//     _(0,-250),
//     "#072227"),
//     new Planet(_(center[0] - center[0]/3, center[1] + center[1]/4),
//     20,
//     1E7,
//     _(250,0),
//     "#072227"),
// ]);

system.physicsStep();