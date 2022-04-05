interface Vector2 {
    x: number;
    y: number;
    toString(): string;
    equals(v: Vector2): boolean;
    add(v: Vector2): Vector2;
    sub(v: Vector2): Vector2;
    mul(n: number): Vector2;
    dot(v: Vector2): number;
    scale(v: Vector2): Vector2;
    div(n: number): Vector2;
    magnitude(): number;
    sqrMagnitude(): number;
    normalize(): Vector2;
    distance(v: Vector2): number;
    angle(v: Vector2): number;
};

class Vector2 {
    static up(): Vector2 {
        return new Vector2(0,1);
    }
    static down(): Vector2 {
        return new Vector2(0,-1);
    }
    static left(): Vector2 {
        return new Vector2(-1,0);
    }
    static right(): Vector2 {
        return new Vector2(1,0);
    }
    static one(): Vector2 {
        return new Vector2(1,1);
    }
    static zero(): Vector2 {
        return new Vector2(0,0);
    }
    toString(): string {
        return `Vector2(${this.x},${this.y})`;
    }
    get 0() {
        return this.x;
    }
    get 1() {
        return this.y;
    }
    equals(v: Vector2): boolean {
        return this === v;
    }
    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    add(v: Vector2): Vector2 {
        return new Vector2(this.x+v.x, this.y+v.y);
    }
    sub(v: Vector2): Vector2 {
        return new Vector2(this.x-v.x, this.y-v.y);
    }
    mul(n: number): Vector2 {
        return new Vector2(this.x*n, this.y*n);
    }
    dot(v: Vector2): number {
        return this.x*v.x + this.y*v.y;
    }
    scale(v: Vector2): Vector2 {
        return new Vector2(this.x*v.x, this.y*v.y);
    }
    div(n: number): Vector2 {
        return new Vector2(this.x/n, this.y/n);
    }
    magnitude(): number {
        return Math.sqrt(this.x**2 + this.y**2);
    }
    sqrMagnitude(): number {
        return this.x**2 + this.y**2;
    }
    normalize(): Vector2 {
        const len = this.magnitude();
        return new Vector2(this.x/len, this.y/len);
    }
    distance(v: Vector2): number {
        return Math.sqrt((this.x-v.x)**2 + (this.y-v.y)**2);
    }
    angle(v: Vector2): number {
        return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()));
    }
    clamp(x: [number,number], y: [number,number]): Vector2 {
        return new Vector2(Math.max(x[0], Math.min(this.x, x[1])), Math.max(y[0], Math.min(this.y, y[1])));
    }
}