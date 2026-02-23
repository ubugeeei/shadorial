# Geometric

Geometric patterns use mathematical repetition and symmetry to create mesmerizing tiling effects. Techniques like domain repetition, rotation, and reflection let you build kaleidoscopes, Islamic-style tilings, and sacred geometry from simple building blocks.

## Domain Repetition

The `fract()` function repeats a pattern across space:

```c
vec2 cell = fract(uv * 5.0); // 5x5 grid of repeated cells
```

Combined with `floor()` to get the cell index, you can vary each cell:

```c
vec2 cellId = floor(uv * 5.0);
float variation = hash(cellId);
```

## Rotation

Rotating UV coordinates creates spiral and pinwheel effects:

```c
mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}
uv = rot(u_time * 0.5) * uv;
```

## Kaleidoscope

A kaleidoscope effect mirrors coordinates around angular segments:

```c
float angle = atan(uv.y, uv.x);
float segments = 6.0;
angle = mod(angle, 6.2831 / segments);
angle = abs(angle - 3.1415 / segments);
uv = vec2(cos(angle), sin(angle)) * length(uv);
```

## The Default Shader

The default code creates a kaleidoscopic tiling pattern with animated rotation, domain repetition, and colored geometric shapes.

## Exercises

1. **Segment count** -- Change the number of kaleidoscope segments and observe the symmetry.
2. **Zoom animation** -- Animate the scale of the pattern to create an infinite zoom effect.
3. **Color palette** -- Use a palette function to color each cell differently.
4. **Hexagonal tiling** -- Implement a hexagonal grid instead of a square grid.
5. **Penrose-style** -- Try overlapping patterns at irrational rotation angles.
