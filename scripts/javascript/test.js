const system = new SolarSystem("screen", 0.001, [ 
    new Planet(_(200,200), 10, 1E10, _(0,0), "black"),
    new Planet(_(400,350), 20, 1E8, _(0,0), "red"),
    new Planet(_(650,450), 100, 1E5, _(0,0), "lightcoral")
]);

system.physicsStep();