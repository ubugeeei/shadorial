# Noise

Noise is the secret ingredient behind natural-looking shader effects. Clouds, terrain, fire, water, marble -- all of these rely on **procedural noise** to create organic patterns that never repeat. In this chapter, we explore value noise, Fractal Brownian Motion (FBM), and domain warping.

## Why Noise?

`fract(sin(...))` gives us random values, but random is not the same as natural. Nature is **smooth randomness** -- neighboring points have similar but not identical values. Noise functions provide this: continuous, smooth, pseudo-random values.

## Value Noise

Value noise assigns random values to grid points and interpolates smoothly between them:

```c
float valueNoise(vec2 p) {
  vec2 i = floor(p);  // grid cell
  vec2 f = fract(p);  // position within cell
  vec2 u = f * f * (3.0 - 2.0 * f); // smooth interpolation

  float a = hash(i);                  // corner values
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
```

The smoothstep-like curve `f * f * (3.0 - 2.0 * f)` prevents visible grid artifacts.

## Fractal Brownian Motion (FBM)

A single layer of noise looks too smooth and uniform. Nature has detail at every scale. **FBM** layers multiple noise samples at increasing frequencies and decreasing amplitudes:

```c
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p);
    p *= 2.0;         // double frequency (each layer = "octave")
    amplitude *= 0.5;  // halve amplitude
  }
  return value;
}
```

Each layer is called an **octave**. More octaves add finer detail.

## Domain Warping

Domain warping feeds the output of one noise function into the input of another. This creates swirling, turbulent patterns:

```c
vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
float f = fbm(p + 4.0 * q);
```

The result looks like smoke, marble, or flowing fluid -- organic patterns that are difficult to achieve any other way.

## The Default Shader

The default code demonstrates a full domain-warped FBM pipeline. Two layers of warping create rich, turbulent patterns mapped to a warm color palette. The animation slowly evolves over time.

## Practical Applications

- **Clouds**: FBM with 4-6 octaves, animated slowly
- **Terrain heightmaps**: FBM sampled at world coordinates
- **Fire**: Domain-warped noise scrolling upward
- **Water caustics**: Noise with sharp contrast enhancement

## Exercises

1. **Change octave count** -- Reduce the FBM loop to 2 octaves and compare with 8 octaves. Observe how detail changes.

2. **Adjust persistence** -- Change the amplitude multiplier from 0.5 to other values (0.3 for smoother, 0.7 for rougher).

3. **Animate the domain** -- Add `u_time` directly to the noise input coordinates to create flowing motion.

4. **Cloud effect** -- Use `smoothstep(0.4, 0.6, fbm(...))` to threshold the noise into cloud-like shapes.

5. **Color mapping** -- Map noise output to a custom color gradient using multiple `mix()` calls at different thresholds.
