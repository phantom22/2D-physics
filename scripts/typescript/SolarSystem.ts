let mousePosition = [-1,-1];
let sP: Planet = null;
let sPPos: Vector2[] = [];
let prevColor = "";
class SolarSystem {
    constructor(canvasId: string, scale: number, planets: Planet[]) {
        const canvas = document.getElementById(canvasId);
        if (!(canvas instanceof HTMLCanvasElement)) return;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.planets = planets;
        this.scale = scale;
        canvas.addEventListener("mousemove", function(e) {
            mousePosition = [e.clientX, e.clientY];
        });
        canvas.addEventListener("mousedown", function(e) {
            this.searchPlanet(e.clientX, e.clientY);
            canvas.classList.add("no-cursor");
        }.bind(this));
        canvas.addEventListener("mouseup", function() {
            canvas.classList.remove("no-cursor");
            if (sP !== null) sP.col = prevColor;
            sP = null;
            sPPos = [];
        }.bind(this));
        canvas.addEventListener("mouseleave", function() {
            canvas.classList.remove("no-cursor");
            if (sP !== null) sP.col = prevColor;
            sP = null;
            sPPos = [];
        }.bind(this));
    }
    searchPlanet(mx: number, my: number): void {
        const mv = new Vector2(mx,my);
        for (let i=0; i<this.planets.length; i++) {
            const { pos,radius } = this.planets[i],
                    dist = mv.distance(pos);
            if (dist <= radius) {
                sP = this.planets[i];
                this.planets[i].dir = Vector2.zero();
                prevColor = this.planets[i].col;
                this.planets[i].col = "white";
                break;
            }
        }
    }
    drawPlanet(p: Planet): void {
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
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (let i=0; i<pl.length; i++) {
            this.drawPlanet(pl[i]);
        }
    }
    physicsStep() {
        const pl = this.planets;
        if (sP !== null) {
            sPPos.push(sP.pos);
            if (sPPos.length > 2) sPPos.shift();

            sP.pos = new Vector2(mousePosition[0], mousePosition[1]);
            if (sPPos.length < 2) {
                sP.dir = sP.dir;
            }
            else {
                const delta = sPPos[1].sub(sPPos[0]);
                sP.dir = delta.magnitude() > 20 ? delta.mul(2.33) : sP.dir;
            }
        }
        for (let a=0; a<pl.length; a++) {
            pl[a].update();
            for (let b=0; b<pl.length; b++) {
                if (b===a) continue;
                if (sP===null||sP!==null&&!sP.equals(pl[a])) pl[a].applyPull(pl[b], this.scale);
                pl[a].checkCollisions(pl[b]);
            }
        }
        this.updateCanvas();
        requestAnimationFrame(this.physicsStep.bind(this));
    }
}