interface Vector2 {
    x: number;
    y: number;
    up(): Vector2;
    down(): Vector2;
    left(): Vector2;
    down(): Vector2;
    one(): Vector2;
    zero(): Vector2;
    toString(): string;
    equals(v: Vector2): boolean;
    compare(v: Vector2): boolean;
    isNaN(): boolean;
    repair(v: number): void;
    clone(): Vector2;
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
    clamp(x: [number,number], y: [number,number]): Vector2;
    simpleClamp(min: number, max: number): Vector2;
};
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
     constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    /**
     * returns a (0,1) vector.
     * @returns {Vector2}
     */
    static up(): Vector2 {
        return new Vector2(0,1);
    }
    /**
     * returns a (0,-1) vector.
     * @returns {Vector2}
     */
    static down(): Vector2 {
        return new Vector2(0,-1);
    }
    /**
     * returns a (-1,0) vector.
     * @returns {Vector2}
     */
    static left(): Vector2 {
        return new Vector2(-1,0);
    }
    /**
     * returns a (1,0) vector.
     * @returns {Vector2}
     */
    static right(): Vector2 {
        return new Vector2(1,0);
    }
    /**
     * returns a (1,1) vector.
     * @returns {Vector2}
     */
    static one(): Vector2 {
        return new Vector2(1,1);
    }
    /**
     * returns a (0,0) vector.
     * @returns {Vector2}
     */
    static zero(): Vector2 {
        return new Vector2(0,0);
    }
    /**
     * returns a formatted string for this vector.
     * @returns {string}
     */
    toString(): string {
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
    equals(v: Vector2): boolean {
        return this === v;
    }
    /**
     * returns true if two vectors are approximately equal.
     * @returns {boolean}
     */
    compare(v: Vector2): boolean {
        return this.x === v.x && this.y === v.y;
    }
    /**
     * checks wether any of the components is not a number.
     * @returns {boolean}
     */
    isNaN(): boolean {
        return Number.isNaN(this.x) || Number.isNaN(this.y)
    }
    /**
     * sets all the NaN components to 0 by default.
     * @param {number} [v=0] 
     */
    repair(v: number = 0): void {
        this.x ||= v;
        this.y ||= v; 
    }
    /**
     * returns a copy of the vector.
     * @returns {Vector2}
     */
    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }
    /**
     * adds two vectors.
     * @param {Vector2} v
     * @returns {Vector2}
     */
    add(v: Vector2): Vector2 {
        return new Vector2(this.x+v.x, this.y+v.y);
    }
    /**
     * subtracts one vector from another.
     * @param {Vector2} v
     * @returns {Vector2}
     */
    sub(v: Vector2): Vector2 {
        return new Vector2(this.x-v.x, this.y-v.y);
    }
    /**
     * multiplies a vector by a number.
     * @param {number} n
     * @returns {Vector2}
     */
    mul(n: number): Vector2 {
        return new Vector2(this.x*n, this.y*n);
    }
    /**
     * dot product of two vectors.
     * @param {Vector2} v
     * @returns {number}
     */
    dot(v: Vector2): number {
        return this.x*v.x + this.y*v.y;
    }
    /**
     * multiplies two vectors component-wise.
     * @param {Vector2} v
     * @returns {Vector2}
     */
    scale(v: Vector2): Vector2 {
        return new Vector2(this.x*v.x, this.y*v.y);
    }
    /**
     * divides a vector by a number.
     * @param {number} n
     * @returns {Vector2}
     */
    div(n: number): Vector2 {
        return new Vector2(this.x/n, this.y/n);
    }
    /**
     * returns the length of this vector.
     * @returns {number}
     */
    magnitude(): number {
        return Math.sqrt(this.x**2 + this.y**2);
    }
    /**
     * returns the squared length of this vector.
     * @returns {number}
     */
    sqrMagnitude(): number {
        return this.x**2 + this.y**2;
    }
    /**
     * returns this vector with a magnitude of 1.
     * @returns {Vector2}
     */
    normalize(): Vector2 {
        const len = this.magnitude();
        return new Vector2(this.x/len, this.y/len);
    }
    /**
     * returns the distance between two vectors.
     * @param {Vector2} v
     * @returns {number}
     */
    distance(v: Vector2): number {
        return Math.sqrt((this.x-v.x)**2 + (this.y-v.y)**2);
    }
    /**
     * returns the angle between two vectors.
     * @param {Vector2} v
     * @returns {number}
     */
    angle(v: Vector2): number {
        return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()));
    }
    /**
     * returns a clamped vector.
     * @param {[number, number]} x [minX, maxX]
     * @param {[number, number]} y [minY, maxY]
     * @returns {Vector2}
     */
    clamp(x: [number,number], y: [number,number]): Vector2 {
        return new Vector2(Math.max(x[0], Math.min(this.x, x[1])), Math.max(y[0], Math.min(this.y, y[1])));
    }
    /**
     * returns a clamped vector.
     * @param {number} min
     * @param {number} max
     * @returns {Vector2}
     */
    simpleClamp(min: number, max: number): Vector2 {
        return new Vector2(Math.max(min, Math.min(this.x, max)), Math.max(min, Math.min(this.y, max)));
    }
}