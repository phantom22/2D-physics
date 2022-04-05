class SolarSystem {
    constructor(canvasId: string, scale: number, planets: Planet[]) {
        const canvas = document.getElementById(canvasId);
        if (!(canvas instanceof HTMLCanvasElement)) return;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.planets = planets;
        this.scale = scale;
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
        for (let a=0; a<pl.length; a++) {
            pl[a].update();
            for (let b=0; b<pl.length; b++) {
                if (b===a) continue;
                pl[a].applyPull(pl[b], this.scale);
                pl[a].checkCollisions(pl[b]);
            }
        }
        this.updateCanvas();
        requestAnimationFrame(this.physicsStep.bind(this));
    }
}