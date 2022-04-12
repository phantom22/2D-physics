const Physics = {
    gravitationalConstant: 6.674E-11
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
    isSelected(): boolean {
        return sP!==null&&sP.equals(this);
    }
    applyPull(p: Planet, scale: number): void {
        const dir = Vec2.normalize(Vec2.sub(p.pos,this.pos)),
              G  = Physics.gravitationalConstant;
            
        const dist = Vec2.distance(this.pos,p.pos);
        const masses = Vec2.mul(Vec2.one,this.mass*p.mass);
        let pull = Vec2.div(masses,dist);
        pull = Vec2.scale(Vec2.mul(pull, G*scale), dir);
        this.dir = Vec2.add(this.dir,pull);
    }
    checkCollisions(p: Planet): void {
        const dist = Vec2.distance(this.pos,p.pos) || 1,
              radii_sum = this.radius+p.radius;
        if (dist <= radii_sum) {
            if (!this.isSelected()) {
                this.pos = [
                    p.pos[0]+(radii_sum+1)*((this.pos[0]-p.pos[0])/dist), 
                    p.pos[1]+(radii_sum+1)*((this.pos[1]-p.pos[1])/dist)
                ];
            }
            this.bounce(p);
        }
    }
    // m1v1 * m2v2 = (m1 + m2)v3
    // v3 = (m1v1 * m2v2)/(m1+m2)
    // v3 = ()
    bounce(p: Planet): void {
        const totMomentum = Vec2.magnitude(this.dir) + Vec2.magnitude(p.dir),
              r1 = p.mass / (this.mass + p.mass), r2 = 1-r1, 
              t = Vec2.clone(this.dir);
        if (!this.isSelected()) this.dir = Vec2.mul(Vec2.normalize(p.dir), totMomentum*r1**2.7);
        if (!p.isSelected()) p.dir = Vec2.mul(Vec2.normalize(t), totMomentum*r2**2.7);

        if (Vec2.isNaN(this.dir)) this.dir = Vec2.repair(this.dir);
        if (Vec2.isNaN(p.dir)) p.dir = Vec2.repair(p.dir);
    }
    update(fps: number): void {
        const width = window.innerWidth,
              height = window.innerHeight;
        const force = Vec2.div(this.dir,fps);
        this.pos = Vec2.add(this.pos,force);
        const [ x,y ] = this.pos,
                r = this.radius;
        let correctedPosition = Vec2.clamp(this.pos, [r, width-r], [r, height-r]);
        if (!this.isSelected()) {
            if (x < r || x > width-r) {
                this.dir = Vec2.scale(this.dir,[-0.96,0.98]);
            }
            if (y < r || y > height-r) {
                this.dir = Vec2.scale(this.dir,[0.98,-0.96]);
            }
        }
        this.pos = correctedPosition;
    }
}