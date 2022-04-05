;
class Vector2 {
    static up() {
        return new Vector2(0, 1);
    }
    static down() {
        return new Vector2(0, -1);
    }
    static left() {
        return new Vector2(-1, 0);
    }
    static right() {
        return new Vector2(1, 0);
    }
    static one() {
        return new Vector2(1, 1);
    }
    static zero() {
        return new Vector2(0, 0);
    }
    toString() {
        return `Vector2(${this.x},${this.y})`;
    }
    get 0() {
        return this.x;
    }
    get 1() {
        return this.y;
    }
    equals(v) {
        return this === v;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    mul(n) {
        return new Vector2(this.x * n, this.y * n);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    scale(v) {
        return new Vector2(this.x * v.x, this.y * v.y);
    }
    div(n) {
        return new Vector2(this.x / n, this.y / n);
    }
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    sqrMagnitude() {
        return this.x ** 2 + this.y ** 2;
    }
    normalize() {
        const len = this.magnitude();
        return new Vector2(this.x / len, this.y / len);
    }
    distance(v) {
        return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
    }
    angle(v) {
        return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()));
    }
    clamp(x, y) {
        return new Vector2(Math.max(x[0], Math.min(this.x, x[1])), Math.max(y[0], Math.min(this.y, y[1])));
    }
}
const Physics = {
    gravitationalConstant: 6.674E-11,
    fps: 60
};
class Planet {
    constructor(pos, radius, mass, dir, col) {
        this.pos = pos;
        this.radius = radius;
        this.mass = mass;
        this.dir = dir;
        this.col = col;
    }
    equals(p) {
        return this === p;
    }
    applyPull(p, scale) {
        const dir = p.pos.sub(this.pos).normalize(), G = Physics.gravitationalConstant;
        const dist = this.pos.distance(p.pos);
        const masses = Vector2.one().mul(this.mass * p.mass);
        let pull = masses.div(dist);
        pull = pull.mul(G * scale).scale(dir);
        this.dir = this.dir.add(pull);
    }
    checkCollisions(p) {
        const dist = this.pos.distance(p.pos) || 1, radii_sum = this.radius + p.radius;
        if (dist <= radii_sum) {
            //p.bounce();
            this.pos = new Vector2(p.pos.x + (radii_sum + 1) * ((this.pos.x - p.pos.x) / dist), p.pos.y + (radii_sum + 1) * ((this.pos.y - p.pos.y) / dist));
            const t = this.dir.clone();
            this.dir = p.dir; //this.dir.sub(p.dir);
            p.dir = t; //p.dir.sub(t);
            return false;
        }
        return true;
    }
    update() {
        const width = window.innerWidth, height = window.innerHeight;
        const force = this.dir.div(Physics.fps);
        this.pos = this.pos.add(force);
        const { x, y } = this.pos, r = this.radius;
        let correctedPosition = this.pos.clamp([0, width - r], [0, height - r]);
        if (x - r <= 0 || x + r >= width) {
            this.dir = this.dir.scale(new Vector2(-0.5, 1));
        }
        if (y - r <= 0 || y + r >= height) {
            this.dir = this.dir.scale(new Vector2(1, -0.5));
        }
        this.pos = correctedPosition;
    }
}
class SolarSystem {
    constructor(canvasId, scale, planets) {
        const canvas = document.getElementById(canvasId);
        if (!(canvas instanceof HTMLCanvasElement))
            return;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.planets = planets;
        this.scale = scale;
    }
    drawPlanet(p) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.col;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = p.col;
        ctx.stroke();
    }
    updateCanvas() {
        const canvas = this.canvas, ctx = this.ctx, pl = this.planets;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < pl.length; i++) {
            this.drawPlanet(pl[i]);
        }
    }
    physicsStep() {
        const pl = this.planets;
        for (let a = 0; a < pl.length; a++) {
            pl[a].update();
            for (let b = 0; b < pl.length; b++) {
                if (b === a)
                    continue;
                pl[a].applyPull(pl[b], this.scale);
                pl[a].checkCollisions(pl[b]);
            }
        }
        this.updateCanvas();
        requestAnimationFrame(this.physicsStep.bind(this));
    }
}
