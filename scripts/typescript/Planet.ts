const Physics = {
    gravitationalConstant: 6.674E-11,
    fps: 60
}

class Planet {
    constructor(pos: Vector2, radius: number, mass: number, dir: Vector2, col: string) {
        this.pos = pos;
        this.radius = radius;
        this.mass = mass;
        this.dir = dir;
        this.col = col;
    }
    equals(p: Planet): boolean {
        return this === p;
    }
    applyPull(p: Planet, scale: number): void {
        const dir = p.pos.sub(this.pos).normalize(),
              G  = Physics.gravitationalConstant;
            
        const dist = this.pos.distance(p.pos);
        const masses = Vector2.one().mul(this.mass*p.mass);
        let pull = masses.div(dist);
        pull = pull.mul(G * scale).scale(dir);
        this.dir = this.dir.add(pull);
    }
    checkCollisions(p: Planet): void {
        const dist = this.pos.distance(p.pos) || 1,
              radii_sum = this.radius+p.radius;
        if (dist <= radii_sum) {
            this.pos = new Vector2(
                p.pos.x+(radii_sum+1)*((this.pos.x-p.pos.x)/dist), 
                p.pos.y+(radii_sum+1)*((this.pos.y-p.pos.y)/dist)
            );
            this.bounce(p);
        }
    }
    // m1v1 * m2v2 = (m1 + m2)v3
    // v3 = (m1v1 * m2v2)/(m1+m2)
    // v3 = ()
    bounce(p: Planet): void {
        const totMomentum = this.dir.magnitude() + p.dir.magnitude(),
              r1 = p.mass / (this.mass + p.mass), r2 = 1-r1, 
              t = this.dir.clone();
        this.dir = p.dir.normalize().mul(totMomentum*r1**2.7);
        p.dir = t.normalize().mul(totMomentum*r2**2.7);

        if (this.dir.isNaN()) this.dir.repair();
        if (p.dir.isNaN()) p.dir.repair();
    }
    update() {
        if (sP !== null && sP.equals(this)) return;
        const width = window.innerWidth,
              height = window.innerHeight;
        const force = this.dir.div(Physics.fps);
        this.pos = this.pos.add(force);
        const { x,y } = this.pos,
                r = this.radius;
        let correctedPosition = this.pos.clamp([0, width-r-1], [0, height-1]);
        if (x-r-1 <= 0 || x+r+1 >= width) {
            this.dir = this.dir.scale(new Vector2(-0.96,0.98));
        }
        if (y-r-1 <= 0 || y+r+1 >= height) {
            this.dir = this.dir.scale(new Vector2(0.98,-0.96));
        }
        this.pos = correctedPosition;
    }
}