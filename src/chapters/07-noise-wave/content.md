# Noise Wave

All the waves we have studied so far -- sine, sawtooth, triangle, and pulse -- are **deterministic** and **periodic**. They repeat perfectly, which makes them predictable. Nature, however, is full of irregularity: flickering flames, drifting clouds, rough terrain. To simulate these organic phenomena, we need **noise**.

## Pseudorandom Numbers in Shaders

Unlike CPU code, GLSL has no built-in random number generator. There is no `rand()` function. Instead, we use **hash functions** -- mathematical formulas that produce seemingly random outputs from deterministic inputs.

### The Classic Hash Function

The most commonly used one-liner for pseudorandom numbers in shaders is:

```c
float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}
```

How this works:

1. `sin(n)` produces a smoothly varying value
2. Multiplying by a large number (`43758.5453`) magnifies tiny differences in the sine output
3. `fract()` takes only the fractional part, producing values between 0 and 1

The result looks random, but it is entirely deterministic -- the same input always produces the same output. This is crucial for shaders, which must produce consistent results across frames and pixels.

### 2D Hash

For 2D inputs, use the dot product to combine coordinates:

```c
float hash2D(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
```

The `vec2(127.1, 311.7)` values are arbitrary constants chosen to produce good distribution. Different constants produce different-looking noise patterns.

## Value Noise

Raw hash values are too chaotic for most uses -- they jump wildly between adjacent pixels. **Value noise** smooths things out by interpolating between random values at integer positions.

### 1D Value Noise

The algorithm:

1. Find the integer positions on either side of the input
2. Get random values at those positions using the hash function
3. Smoothly interpolate between them

```c
float noise(float x) {
  float i = floor(x);    // integer part (left grid point)
  float f = fract(x);    // fractional part (position between grid points)

  // Smooth interpolation curve
  float u = f * f * (3.0 - 2.0 * f);

  // Interpolate between random values
  return mix(hash(i), hash(i + 1.0), u);
}
```

The smoothing curve `f * f * (3.0 - 2.0 * f)` is called a **smoothstep Hermite interpolation**. It ensures that the transitions between random values are smooth rather than linear. Without it, the noise would have visible kinks at every integer boundary.

### Why Not Linear Interpolation?

If you replace the smooth curve with plain `f`:

```c
return mix(hash(i), hash(i + 1.0), f);  // linear interpolation
```

You get **linear value noise**, which has visible creases at every grid point. The smooth version looks much more natural.

## Using Noise for Waves

The simplest use of noise is to create an irregular, organic-looking wave:

```c
float noiseWave = noise(x * frequency + u_time * speed);
```

By multiplying `x` by a frequency value, you control the scale of the irregularity. Higher frequency means more fine-grained variation; lower frequency means broad, sweeping undulations.

### Layered Noise

A single layer of noise looks simple and blobby. For more interesting results, layer multiple noise calls at different frequencies (also called **octaves**):

```c
float wave = noise(x * 2.0 + u_time) * 0.6;
wave += noise(x * 5.0 - u_time * 0.7) * 0.2;
wave += noise(x * 11.0 + u_time * 0.3) * 0.1;
```

Each layer adds finer detail at a smaller amplitude. This is the basic idea behind **Fractal Brownian Motion (FBM)**, which we will cover in depth in a later chapter.

## The Default Shader

The default code demonstrates noise in action:

- A **cyan noise wave** made from two noise layers at different frequencies
- A **dim blue sine wave** drawn behind it for comparison

The noise wave visibly differs from the sine -- it has irregular peaks and valleys, with no exact repetition. The sine wave, by contrast, is perfectly smooth and periodic. This contrast helps illustrate why noise is valuable for organic effects.

The background also uses a subtle noise value to add a slight variation to the dark background, demonstrating that noise can enhance even the simplest visual elements.

## Hash Quality Considerations

The `sin()`-based hash function is widely used but has known weaknesses:

- On some GPUs, `sin()` has limited precision, which can cause visible patterns
- The output is not uniformly distributed in a strict mathematical sense

For production use, consider alternative hash functions:

```c
// Integer-based hash (better distribution)
float hash(float n) {
  uint h = uint(int(n));
  h = h * 747796405u + 2891336453u;
  h = ((h >> 16u) ^ h) * 0x45d9f3bu;
  return float((h >> 16u) ^ h) / float(0xffffffffu);
}
```

However, for learning and most visual effects, the `sin()`-based hash is perfectly adequate.

## Noise vs. Randomness

An important distinction:

- **Random**: Each value is independent. No correlation between neighboring values. Looks like static / white noise.
- **Noise**: Values change smoothly. Neighboring positions have similar values. Looks like clouds, terrain, or organic textures.

The hash function gives us randomness. The interpolation in our `noise()` function converts that randomness into smooth noise. Both have their uses, but smooth noise is far more common in visual effects.

## Exercises

1. **Change the noise frequency** -- Modify `noise(x * 2.0 + u_time)` to use `x * 8.0` instead. Notice how the wave becomes more jittery with higher frequency noise.

2. **Remove the smoothing** -- In the `noise()` function, replace `f * f * (3.0 - 2.0 * f)` with just `f`. Compare the visual difference -- look for the sharp kinks at grid points.

3. **Static noise texture** -- Instead of drawing a wave line, fill the screen with noise: `vec3(noise(uv.x * 20.0 + uv.y * 30.0))`. This creates a static noise texture.

4. **Animated noise field** -- Fill the screen with 2D noise: use `hash2D(floor(uv * 20.0) + floor(u_time * 5.0))` for an animated TV-static effect.

5. **Three-layer noise wave** -- Add a third noise layer: `noise(x * 11.0 + u_time * 0.3) * 0.1`. Each layer adds finer detail.

6. **Noise-distorted sine** -- Use noise to distort a sine wave: `sin(x + noise(x * 3.0 + u_time) * 2.0)`. This produces a sine wave that wobbles irregularly.

In the next chapter, we will learn how to combine multiple waves together to create complex, rich patterns through wave composition.
