let mousePosition = <Vector2>[-1,-1];
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
            mousePosition = [e.clientX, e.clientY];
            this.searchPlanet(e.clientX, e.clientY);
            canvas.classList.add("no-cursor");
        }.bind(this));
        canvas.addEventListener("mouseup mouseleave", function() {
            canvas.classList.remove("no-cursor");
            if (sP !== null) sP.col = prevColor;
            sP = null;
            sPPos = [];
        }.bind(this));
    }
    searchPlanet(mx: number, my: number): void {
        for (let i=0; i<this.planets.length; i++) {
            const { pos,radius } = this.planets[i],
                    dist = Vec2.distance([mx,my],pos);
            if (dist <= radius) {
                sP = this.planets[i];
                this.planets[i].dir = Vec2.zero;
                prevColor = this.planets[i].col;
                this.planets[i].col = "white";
                break;
            }
        }
    }
    drawPlanet(p: Planet): void {
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
        for (let i=0; i<pl.length; i++) {
            this.drawPlanet(pl[i]);
        }
    }
    physicsStep() {
        const pl = this.planets;
        if (sP !== null) {
            sPPos.push(sP.pos);
            if (sPPos.length > 2) sPPos.shift();

            sP.pos = [mousePosition[0], mousePosition[1]];
            if (sPPos.length < 2) {
                sP.dir = sP.dir;
            }
            else {
                const delta = Vec2.sub(sPPos[1],sPPos[0]);
                sP.dir = Vec2.magnitude(delta) > 20 ? Vec2.mul(delta,2.33) : sP.dir;
            }
        }
        for (let a=0; a<pl.length; a++) {
            for (let b=0; b<pl.length; b++) {
                if (b===a) continue;
                pl[a].checkCollisions(pl[b]);
            }
            pl[a].update();
            for (let b=0; b<pl.length; b++) {
                if (b===a) continue;
                if (sP===null||sP!==null&&!sP.equals(pl[a])) pl[a].applyPull(pl[b], this.scale);
            }
        }
        this.updateCanvas();
        requestAnimationFrame(this.physicsStep.bind(this));
    }
}