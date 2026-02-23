# Shapes & SDF

Until now, we have worked mainly in one dimension -- drawing waves as lines on the screen. In this chapter, we enter the world of **2D shapes** using a powerful technique called **Signed Distance Functions** (SDFs).

## What is a Signed Distance Function?

A Signed Distance Function is a function that, for any point in space, returns the **distance** to the nearest surface of a shape. The key property is the **sign**:

- **Positive** values mean the point is **outside** the shape.
- **Negative** values mean the point is **inside** the shape.
- **Zero** means the point is exactly **on** the boundary.

```c
float d = sdCircle(uv, 0.3);
// d > 0.0  → outside
// d < 0.0  → inside
// d == 0.0 → on the edge
```

This simple concept is remarkably powerful. Once you have a distance value, you can fill shapes, draw outlines, create glow effects, and combine shapes using simple math.

## Circle SDF

The simplest SDF is a circle. The distance from any point `p` to a circle centered at the origin with radius `r` is:

```c
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}
```

`length(p)` is the distance from `p` to the origin. Subtracting the radius shifts the zero-crossing to the circle boundary.

## Rectangle SDF

A rectangle (axis-aligned, centered at origin) with half-size `b`:

```c
float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
```

The `abs(p)` exploits symmetry -- we only need to compute for one quadrant. Adding a corner radius `r` creates a rounded rectangle:

```c
float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
```

## Drawing Shapes with smoothstep

Raw distance values are not directly useful as colors. We use `smoothstep` to convert the distance into a sharp but anti-aliased edge:

```c
float pixelSize = 1.5 / u_resolution.y;
float fill = 1.0 - smoothstep(0.0, pixelSize, distance);
```

This creates a smooth transition over exactly one pixel, producing clean edges without jagged aliasing artifacts.

## Combining SDFs

One of the most powerful aspects of SDFs is how easily they combine.

### Union (OR)

To show **both** shapes, take the **minimum** distance:

```c
float dUnion = min(dCircle, dRect);
```

### Intersection (AND)

To show only the **overlap**, take the **maximum**:

```c
float dIntersect = max(dCircle, dRect);
```

### Subtraction (NOT)

To **cut** one shape from another, negate and take the maximum:

```c
float dSubtract = max(dCircle, -dRect); // circle minus rect
```

### Smooth Union

For organic-looking blends, use a smooth minimum:

```c
float smoothMin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
```

The parameter `k` controls the blending radius. Larger values produce smoother joins.

## Visualizing the Distance Field

The default shader shows concentric rings around each shape. These rings represent **isolines** of the distance field -- lines of equal distance. This visualization helps you understand how the distance value changes across space.

## The Default Shader

The default code demonstrates three shapes:

- A **circle** (blue) using `sdCircle`
- A **rounded rectangle** (red) using `sdRoundedRect`
- A **triangle** (green) using `sdTriangle`

Each shape gently orbits its resting position. The background shows the distance field with concentric bands, and each shape has a soft dark outline.

## Exercises

1. **Shape morphing** -- Blend between two SDF shapes using `mix(dCircle, dRect, 0.5 + 0.5 * sin(u_time))`. As the blend parameter changes, the shape smoothly transitions.

2. **Boolean operations** -- Replace the `min()` union with `max()` to see the intersection. Try subtraction with `max(dCircle, -dRect)`.

3. **Smooth union** -- Implement `smoothMin` and use it to blend two shapes together. Animate the `k` parameter with `u_time`.

4. **Glow effect** -- Instead of a hard fill, use `exp(-distance * 10.0)` to create a soft glow around a shape.

5. **Repeating shapes** -- Use `mod()` to tile the UV space: `vec2 q = mod(uv, 0.4) - 0.2;` and evaluate an SDF on `q`. This creates an infinite grid of shapes.

6. **Outline only** -- Draw only the outline of a shape by using `abs(distance) - thickness` as the SDF. This hollows out the shape, leaving just the border.

In the next chapter, we will add light and reflection to bring these flat shapes to life.
