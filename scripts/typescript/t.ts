interface Planet {
    pos: Vector2;
    radius: number;
    mass: number;
    dir: Vector2;
    col: string;
    applyPull(p: Planet, scale: number): void;
    update(): void;
}

interface SolarSystem {
    scale: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    planets: Planet[];
    updateCanvas(): void;
    physicsStep(): void;
}

