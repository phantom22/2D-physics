type Vector2 = [number,number];
function Vec2(x: number, y: number): Vector2 {
    return [x,y];
}
Vec2.up = <Vector2>[0,1];
Vec2.down = <Vector2>[0,-1];
Vec2.left = <Vector2>[-1,0];
Vec2.right = <Vector2>[1,0];
Vec2.one = <Vector2>[1,1];
Vec2.zero = <Vector2>[0,0];
Vec2.toString = (v: Vector2) => `Vector2(${v[0]},${v[1]})`;
Vec2.equals = (a: Vector2, b: Vector2) => a === b;
Vec2.compare = (a: Vector2, b: Vector2) => a[0] === b[0] && a[1] === b[1];
Vec2.isNaN = (v: Vector2) => Number.isNaN(v[0]) || Number.isNaN(v[1]);
Vec2.repair = (v: Vector2, _=0): Vector2 => [v[0]||_,v[1]||_]
Vec2.clone = (v: Vector2): Vector2 => [...v];
Vec2.add = (a: Vector2, b: Vector2): Vector2 => [a[0]+b[0], a[1]+b[1]];
Vec2.sub = (a: Vector2, b: Vector2): Vector2 => [a[0]-b[0], a[1]-b[1]];
Vec2.mul = (v: Vector2, _: number): Vector2 => [v[0]*_, v[1]*_];
Vec2.dot = (a: Vector2, b: Vector2) => a[0]*b[0]+a[1]*b[1];
Vec2.scale = (a: Vector2, b: Vector2): Vector2 => [a[0]*b[0],a[1]*b[1]];
Vec2.div = (v: Vector2, _: number): Vector2 => { const t=1/_; return [v[0]*t, v[1]*t] };
Vec2.magnitude = (v: Vector2) => (v[0]**2+v[1]**2)**(1/2);
Vec2.sqrMagnitude = (v: Vector2) => v[0]**2+v[1]**2;
Vec2.normalize = (v: Vector2): Vector2 => { const t=1/Vec2.magnitude(v); return [v[0]*t, v[1]*t] };
Vec2.distance = (a: Vector2, b: Vector2) => ((a[0]-b[0])**2 + (a[1]-b[1])**2)**(1/2);
Vec2.angle = (a: Vector2, b: Vector2) => Math.acos(Vec2.dot(a,b) / (Vec2.magnitude(a) * Vec2.magnitude(b)));
Vec2.clamp = (v: Vector2, x: Vector2, y: Vector2): Vector2 => [Math.max(x[0], Math.min(v[0], x[1])), Math.max(y[0], Math.min(v[1], y[1]))];
Vec2.simpleClamp = (v: Vector2, min: number, max: number): Vector2 => [Math.max(min, Math.min(v[0], max)), Math.max(min, Math.min(v[1], max))];
Object.freeze(Vec2);