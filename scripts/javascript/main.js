function Vec2(x, y) {
    return [x, y];
}
Vec2.up = [0, 1];
Vec2.down = [0, -1];
Vec2.left = [-1, 0];
Vec2.right = [1, 0];
Vec2.one = [1, 1];
Vec2.zero = [0, 0];
Vec2.toString = (v) => `Vector2(${v[0]},${v[1]})`;
Vec2.equals = (a, b) => a === b;
Vec2.compare = (a, b) => a[0] === b[0] && a[1] === b[1];
Vec2.isNaN = (v) => Number.isNaN(v[0]) || Number.isNaN(v[1]);
Vec2.repair = (v, _ = 0) => [v[0] || _, v[1] || _];
Vec2.clone = (v) => [...v];
Vec2.add = (a, b) => [a[0] + b[0], a[1] + b[1]];
Vec2.sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
Vec2.mul = (v, _) => [v[0] * _, v[1] * _];
Vec2.dot = (a, b) => a[0] * b[0] + a[1] * b[1];
Vec2.scale = (a, b) => [a[0] * b[0], a[1] * b[1]];
Vec2.div = (v, _) => { const t = 1 / _; return [v[0] * t, v[1] * t]; };
Vec2.magnitude = (v) => (v[0] ** 2 + v[1] ** 2) ** (1 / 2);
Vec2.sqrMagnitude = (v) => v[0] ** 2 + v[1] ** 2;
Vec2.normalize = (v) => { const t = 1 / Vec2.magnitude(v); return [v[0] * t, v[1] * t]; };
Vec2.distance = (a, b) => ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** (1 / 2);
Vec2.angle = (a, b) => Math.acos(Vec2.dot(a, b) / (Vec2.magnitude(a) * Vec2.magnitude(b)));
Vec2.clamp = (v, x, y) => [Math.max(x[0], Math.min(v[0], x[1])), Math.max(y[0], Math.min(v[1], y[1]))];
Vec2.simpleClamp = (v, min, max) => [Math.max(min, Math.min(v[0], max)), Math.max(min, Math.min(v[1], max))];
Object.freeze(Vec2);
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
    isSelected() {
        return sP !== null && sP.equals(this);
    }
    applyPull(p, scale) {
        const dir = Vec2.normalize(Vec2.sub(p.pos, this.pos)), G = Physics.gravitationalConstant;
        const dist = Vec2.distance(this.pos, p.pos);
        const masses = Vec2.mul(Vec2.one, this.mass * p.mass);
        let pull = Vec2.div(masses, dist);
        pull = Vec2.scale(Vec2.mul(pull, G * scale), dir);
        this.dir = Vec2.add(this.dir, pull);
    }
    checkCollisions(p) {
        const dist = Vec2.distance(this.pos, p.pos) || 1, radii_sum = this.radius + p.radius;
        if (dist <= radii_sum) {
            if (!this.isSelected()) {
                this.pos = [
                    p.pos[0] + (radii_sum + 1) * ((this.pos[0] - p.pos[0]) / dist),
                    p.pos[1] + (radii_sum + 1) * ((this.pos[1] - p.pos[1]) / dist)
                ];
            }
            this.bounce(p);
        }
    }
    // m1v1 * m2v2 = (m1 + m2)v3
    // v3 = (m1v1 * m2v2)/(m1+m2)
    // v3 = ()
    bounce(p) {
        const totMomentum = Vec2.magnitude(this.dir) + Vec2.magnitude(p.dir), r1 = p.mass / (this.mass + p.mass), r2 = 1 - r1, t = Vec2.clone(this.dir);
        if (!this.isSelected())
            this.dir = Vec2.mul(Vec2.normalize(p.dir), totMomentum * r1 ** 2.7);
        if (!p.isSelected())
            p.dir = Vec2.mul(Vec2.normalize(t), totMomentum * r2 ** 2.7);
        if (Vec2.isNaN(this.dir))
            this.dir = Vec2.repair(this.dir);
        if (Vec2.isNaN(p.dir))
            p.dir = Vec2.repair(p.dir);
    }
    update() {
        if (this.isSelected())
            return;
        const width = window.innerWidth, height = window.innerHeight;
        const force = Vec2.div(this.dir, Physics.fps);
        this.pos = Vec2.add(this.pos, force);
        const [x, y] = this.pos, r = this.radius;
        let correctedPosition = Vec2.clamp(this.pos, [r, width - r], [r, height - r]);
        if (x < r || x > width - r) {
            this.dir = Vec2.scale(this.dir, [-0.96, 0.98]);
        }
        if (y < r || y > height - r) {
            this.dir = Vec2.scale(this.dir, [0.98, -0.96]);
        }
        this.pos = correctedPosition;
    }
}
let mousePosition = [-1, -1];
let sP = null;
let sPPos = [];
let prevColor = "";
class SolarSystem {
    constructor(canvasId, scale, planets) {
        const canvas = document.getElementById(canvasId);
        if (!(canvas instanceof HTMLCanvasElement))
            return;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.planets = planets;
        this.scale = scale;
        canvas.addEventListener("mousemove", function (e) {
            mousePosition = [e.clientX, e.clientY];
        });
        canvas.addEventListener("mousedown", function (e) {
            mousePosition = [e.clientX, e.clientY];
            this.searchPlanet(e.clientX, e.clientY);
            canvas.classList.add("no-cursor");
        }.bind(this));
        canvas.addEventListener("mouseup mouseleave", function () {
            canvas.classList.remove("no-cursor");
            if (sP !== null)
                sP.col = prevColor;
            sP = null;
            sPPos = [];
        }.bind(this));
    }
    searchPlanet(mx, my) {
        for (let i = 0; i < this.planets.length; i++) {
            const { pos, radius } = this.planets[i], dist = Vec2.distance([mx, my], pos);
            if (dist <= radius) {
                sP = this.planets[i];
                this.planets[i].dir = Vec2.zero;
                prevColor = this.planets[i].col;
                this.planets[i].col = "white";
                break;
            }
        }
    }
    drawPlanet(p) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(p.pos[0], p.pos[1], p.radius, 0, Math.PI * 2);
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
        //ctx.clearRect(0,0,canvas.width,canvas.height);
        for (let i = 0; i < pl.length; i++) {
            this.drawPlanet(pl[i]);
        }
    }
    physicsStep() {
        const pl = this.planets;
        if (sP !== null) {
            sPPos.push(sP.pos);
            if (sPPos.length > 2)
                sPPos.shift();
            sP.pos = [mousePosition[0], mousePosition[1]];
            if (sPPos.length < 2) {
                sP.dir = sP.dir;
            }
            else {
                const delta = Vec2.sub(sPPos[1], sPPos[0]);
                sP.dir = Vec2.magnitude(delta) > 20 ? Vec2.mul(delta, 2.33) : sP.dir;
            }
        }
        for (let a = 0; a < pl.length; a++) {
            for (let b = 0; b < pl.length; b++) {
                if (b === a)
                    continue;
                pl[a].checkCollisions(pl[b]);
            }
            pl[a].update();
            for (let b = 0; b < pl.length; b++) {
                if (b === a)
                    continue;
                if (sP === null || sP !== null && !sP.equals(pl[a]))
                    pl[a].applyPull(pl[b], this.scale);
            }
        }
        this.updateCanvas();
        requestAnimationFrame(this.physicsStep.bind(this));
    }
}
