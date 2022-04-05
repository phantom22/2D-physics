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
    checkCollisions(p: Planet): boolean {
        const dist = this.pos.distance(p.pos) || 1,
              radii_sum = this.radius+p.radius;
        if (dist <= radii_sum) {
            //p.bounce();
            this.pos = new Vector2(
                p.pos.x+(radii_sum+1)*((this.pos.x-p.pos.x)/dist), 
                p.pos.y+(radii_sum+1)*((this.pos.y-p.pos.y)/dist)
            );
            const t = this.dir.clone();
            // MASS RATIO
            this.dir = p.dir;//this.dir.sub(p.dir);
            p.dir = t;//p.dir.sub(t);
            return false;
        }
        return true;
    }
    update() {
        const width = window.innerWidth,
              height = window.innerHeight;
        const force = this.dir.div(Physics.fps);
        this.pos = this.pos.add(force);
        const { x,y } = this.pos,
                r = this.radius;
        let correctedPosition = this.pos.clamp([0, width-r], [0, height-r]);
        if (x-r <= 0 || x+r >= width) {
            this.dir = this.dir.scale(new Vector2(-1,1));
        }
        if (y-r-0.5 <= 0 || y+r >= height) {
            this.dir = this.dir.scale(new Vector2(1,-1));
        }
        this.pos = correctedPosition;
    }
}