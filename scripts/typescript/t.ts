interface Planet {
    pos: Vector2;
    radius: number;
    mass: number;
    dir: Vector2;
    col: string;
    applyPull(p: Planet, scale: number): void;
    update(fps: number): void;
    bounce(p: Planet): void;
    checkCollision(p: Planet): void;
}

interface SolarSystem {
    scale: number;
    fps: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    planets: Planet[];
    updateCanvas(): void;
    physicsStep(): void;
}

