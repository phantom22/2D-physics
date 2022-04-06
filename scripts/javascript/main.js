;
/**
 * representation of 2D vectors and points.
 * @class
 * @property {number} x horizontal position.
 * @property {number} y vertical position.
 */
class Vector2 {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * returns a (0,1) vector.
     * @returns {Vector2}
     */
    static up() {
        return new Vector2(0, 1);
    }
    /**
     * returns a (0,-1) vector.
     * @returns {Vector2}
     */
    static down() {
        return new Vector2(0, -1);
    }
    /**
     * returns a (-1,0) vector.
     * @returns {Vector2}
     */
    static left() {
        return new Vector2(-1, 0);
    }
    /**
     * returns a (1,0) vector.
     * @returns {Vector2}
     */
    static right() {
        return new Vector2(1, 0);
    }
    /**
     * returns a (1,1) vector.
     * @returns {Vector2}
     */
    static one() {
        return new Vector2(1, 1);
    }
    /**
     * returns a (0,0) vector.
     * @returns {Vector2}
     */
    static zero() {
        return new Vector2(0, 0);
    }
    /**
     * returns a formatted string for this vector.
     * @returns {string}
     */
    toString() {
        return `Vector2(${this.x},${this.y})`;
    }
    /**
     * X component of the vector (read-only).
     * @returns {number}
     */
    get 0() {
        return this.x;
    }
    /**
     * Y component of the vector (read-only).
     * @returns {number}
     */
    get 1() {
        return this.y;
    }
    /**
     * returns true if the given vector is exactly equal to this vector.
     * @returns {boolean}
     */
    equals(v) {
        return this === v;
    }
    /**
     * returns true if two vectors are approximately equal.
     * @returns {boolean}
     */
    compare(v) {
        return this.x === v.x && this.y === v.y;
    }
    /**
     * checks wether any of the components is not a number.
     * @returns {boolean}
     */
    isNaN() {
        return Number.isNaN(this.x) || Number.isNaN(this.y);
    }
    /**
     * sets all the NaN components to 0 by default.
     * @param {number} [v=0]
     */
    repair(v = 0) {
        this.x ||= v;
        this.y ||= v;
    }
    /**
     * returns a copy of the vector.
     * @returns {Vector2}
     */
    clone() {
        return new Vector2(this.x, this.y);
    }
    /**
     * adds two vectors.
     * @param {Vector2} v
     * @returns {Vector2}
     */
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    /**
     * subtracts one vector from another.
     * @param {Vector2} v
     * @returns {Vector2}
     */
    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    /**
     * multiplies a vector by a number.
     * @param {number} n
     * @returns {Vector2}
     */
    mul(n) {
        return new Vector2(this.x * n, this.y * n);
    }
    /**
     * dot product of two vectors.
     * @param {Vector2} v
     * @returns {number}
     */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    /**
     * multiplies two vectors component-wise.
     * @param {Vector2} v
     * @returns {Vector2}
     */
    scale(v) {
        return new Vector2(this.x * v.x, this.y * v.y);
    }
    /**
     * divides a vector by a number.
     * @param {number} n
     * @returns {Vector2}
     */
    div(n) {
        return new Vector2(this.x / n, this.y / n);
    }
    /**
     * returns the length of this vector.
     * @returns {number}
     */
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    /**
     * returns the squared length of this vector.
     * @returns {number}
     */
    sqrMagnitude() {
        return this.x ** 2 + this.y ** 2;
    }
    /**
     * returns this vector with a magnitude of 1.
     * @returns {Vector2}
     */
    normalize() {
        const len = this.magnitude();
        return new Vector2(this.x / len, this.y / len);
    }
    /**
     * returns the distance between two vectors.
     * @param {Vector2} v
     * @returns {number}
     */
    distance(v) {
        return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
    }
    /**
     * returns the angle between two vectors.
     * @param {Vector2} v
     * @returns {number}
     */
    angle(v) {
        return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()));
    }
    /**
     * returns a clamped vector.
     * @param {[number, number]} x [minX, maxX]
     * @param {[number, number]} y [minY, maxY]
     * @returns {Vector2}
     */
    clamp(x, y) {
        return new Vector2(Math.max(x[0], Math.min(this.x, x[1])), Math.max(y[0], Math.min(this.y, y[1])));
    }
    /**
     * returns a clamped vector.
     * @param {number} min
     * @param {number} max
     * @returns {Vector2}
     */
    simpleClamp(min, max) {
        return new Vector2(Math.max(min, Math.min(this.x, max)), Math.max(min, Math.min(this.y, max)));
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
            this.pos = new Vector2(p.pos.x + (radii_sum + 1) * ((this.pos.x - p.pos.x) / dist), p.pos.y + (radii_sum + 1) * ((this.pos.y - p.pos.y) / dist));
            this.bounce(p);
        }
    }
    // m1v1 * m2v2 = (m1 + m2)v3
    // v3 = (m1v1 * m2v2)/(m1+m2)
    // v3 = ()
    bounce(p) {
        const totMomentum = this.dir.magnitude() + p.dir.magnitude(), r1 = p.mass / (this.mass + p.mass), r2 = 1 - r1, t = this.dir.clone();
        this.dir = p.dir.normalize().mul(totMomentum * r1 ** 2.7);
        p.dir = t.normalize().mul(totMomentum * r2 ** 2.7);
        if (this.dir.isNaN())
            this.dir.repair();
        if (p.dir.isNaN())
            p.dir.repair();
    }
    update() {
        if (sP !== null && sP.equals(this))
            return;
        const width = window.innerWidth, height = window.innerHeight;
        const force = this.dir.div(Physics.fps);
        this.pos = this.pos.add(force);
        const { x, y } = this.pos, r = this.radius;
        let correctedPosition = this.pos.clamp([0, width - r - 1], [0, height - 1]);
        if (x - r - 1 <= 0 || x + r + 1 >= width) {
            this.dir = this.dir.scale(new Vector2(-0.96, 0.98));
        }
        if (y - r - 1 <= 0 || y + r + 1 >= height) {
            this.dir = this.dir.scale(new Vector2(0.98, -0.96));
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
            this.searchPlanet(e.clientX, e.clientY);
            canvas.classList.add("no-cursor");
        }.bind(this));
        canvas.addEventListener("mouseup", function () {
            canvas.classList.remove("no-cursor");
            if (sP !== null)
                sP.col = prevColor;
            sP = null;
            sPPos = [];
        }.bind(this));
        canvas.addEventListener("mouseleave", function () {
            canvas.classList.remove("no-cursor");
            if (sP !== null)
                sP.col = prevColor;
            sP = null;
            sPPos = [];
        }.bind(this));
    }
    searchPlanet(mx, my) {
        const mv = new Vector2(mx, my);
        for (let i = 0; i < this.planets.length; i++) {
            const { pos, radius } = this.planets[i], dist = mv.distance(pos);
            if (dist <= radius) {
                sP = this.planets[i];
                this.planets[i].dir = Vector2.zero();
                prevColor = this.planets[i].col;
                this.planets[i].col = "white";
                break;
            }
        }
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
        if (sP !== null) {
            sPPos.push(sP.pos);
            if (sPPos.length > 2)
                sPPos.shift();
            sP.pos = new Vector2(mousePosition[0], mousePosition[1]);
            if (sPPos.length < 2) {
                sP.dir = sP.dir;
            }
            else {
                const delta = sPPos[1].sub(sPPos[0]);
                sP.dir = delta.magnitude() > 20 ? delta.mul(2.33) : sP.dir;
            }
        }
        for (let a = 0; a < pl.length; a++) {
            pl[a].update();
            for (let b = 0; b < pl.length; b++) {
                if (b === a)
                    continue;
                if (sP === null || sP !== null && !sP.equals(pl[a]))
                    pl[a].applyPull(pl[b], this.scale);
                pl[a].checkCollisions(pl[b]);
            }
        }
        this.updateCanvas();
        requestAnimationFrame(this.physicsStep.bind(this));
    }
}
