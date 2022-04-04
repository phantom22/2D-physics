;
function _(x, y) {
    return new Vector2D(x, y);
}
class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    vec() {
        return [this.x, this.y];
    }
    sum(v) {
        this.x += v.x;
        this.y += v.y;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
    mul(n) {
        this.x *= n;
        this.y *= n;
    }
    div(n) {
        this.x /= n;
        this.y /= n;
    }
    _sum(v) {
        return _(this.x + v.x, this.y + v.y);
    }
    _sub(v) {
        return _(this.x - v.x, this.y - v.y);
    }
    _mul(n) {
        return _(this.x * n, this.y * n);
    }
    _div(n) {
        return _(this.x / n, this.y / n);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    dist(v) {
        return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
    }
    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    dir() {
        const len = this.length();
        return [this.x / len, this.y / len];
    }
}
class Planet {
    constructor(pos, radius, mass, dir, col) {
        this.pos = pos;
        this.radius = radius;
        this.mass = mass;
        this.dir = dir;
        this.col = col;
    }
    update() {
        this.pos.sum(this.dir._div(60));
    }
    calcPull(p, scale) {
        const dir = p.pos._sub(this.pos);
        const x = 6.674E-11 * ((this.mass * p.mass) / (this.pos.x - p.pos.x) ** 2) * (dir.x / dir.length()), y = 6.674E-11 * ((this.mass * p.mass) / (this.pos.y - p.pos.y) ** 2) * (dir.y / dir.length());
        return _(x, y)._mul(scale);
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
    updateCanvas() {
        const canvas = this.canvas, ctx = this.ctx, pl = this.planets;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let p = 0; p < pl.length; p++) {
            const c = pl[p];
            c.update();
            ctx.beginPath();
            ctx.arc(c.pos.x, c.pos.y, c.radius, 0, Math.PI * 2);
            ctx.fillStyle = c.col;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = c.col;
            ctx.stroke();
        }
    }
    physicsStep() {
        const pl = this.planets;
        for (let a = 0; a < pl.length; a++) {
            let pull = _(0, 0);
            for (let b = 0; b < pl.length; b++) {
                if (b === a)
                    continue;
                pull.sum(pl[a].calcPull(pl[b], this.scale));
            }
            pl[a].dir.sum(pull);
        }
        this.updateCanvas();
        requestAnimationFrame(this.physicsStep.bind(this));
    }
}
