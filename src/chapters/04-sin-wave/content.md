# Sin Wave

The sine wave is one of the most fundamental building blocks in shader programming. It appears everywhere -- from gentle oscillations and pulsing effects to complex animations and procedural textures. Mastering `sin()` will unlock a huge range of visual possibilities.

## The `sin()` Function

The GLSL `sin()` function works exactly like the mathematical sine function. It takes an angle in **radians** and returns a value between `-1.0` and `1.0`:

```c
float y = sin(x);
```

One complete cycle of a sine wave spans `2 * PI` radians (approximately `6.2832`). The wave starts at 0, rises to 1 at PI/2, returns to 0 at PI, drops to -1 at 3*PI/2, and completes the cycle back at 0.

## Anatomy of a Wave

Every wave can be described by three key properties:

### Amplitude

**Amplitude** controls the height of the wave -- how far it swings above and below the center line. Multiply the sine output to change amplitude:

```c
float wave = amplitude * sin(x);
// amplitude = 0.5 gives a wave from -0.5 to +0.5
// amplitude = 2.0 gives a wave from -2.0 to +2.0
```

### Frequency

**Frequency** controls how many cycles occur over a given distance. Multiply the input to change frequency:

```c
float wave = sin(frequency * x);
// frequency = 1.0 gives one cycle per 2*PI units
// frequency = 3.0 gives three cycles per 2*PI units
```

Higher frequency means more tightly packed waves. Lower frequency means stretched-out, gentle waves.

### Phase

**Phase** shifts the wave left or right along the x-axis. Add an offset to the input:

```c
float wave = sin(x + phase);
```

When we use `u_time` as the phase, the wave appears to move:

```c
float wave = sin(x + u_time);  // wave scrolls to the left over time
```

### Putting It All Together

The general form of a sine wave is:

```c
float wave = amplitude * sin(frequency * x + phase);
```

In the default shader for this chapter, we use exactly this formula:

```c
float amplitude = 0.5;
float frequency = 1.0;
float phase = u_time * 2.0;
float wave = amplitude * sin(frequency * x + phase);
```

## Drawing a Wave as a Line

Unlike plotting on a graphing calculator, a fragment shader evaluates every pixel independently. We cannot simply "connect the dots." Instead, we compute the **distance** from the current pixel to the wave curve and color the pixel based on that distance.

The technique is:

1. Compute the wave value at the current x position.
2. Calculate the vertical distance from the pixel to the wave.
3. Use `smoothstep` to create a smooth, anti-aliased line.

```c
float wave = amplitude * sin(frequency * x + phase);
float dist = abs(y - wave);
float line = 1.0 - smoothstep(0.0, lineWidth, dist);
```

When `dist` is 0 (pixel is exactly on the curve), `smoothstep` returns 0, and `line` is 1.0 (fully bright). As `dist` increases toward `lineWidth`, the brightness fades smoothly to 0. This produces a clean, anti-aliased line without jagged edges.

### Choosing Line Width

The `lineWidth` value should be chosen relative to your coordinate system. In the default shader, the y-axis spans from -1 to 1 (a total range of 2 units), and we use a line width of `0.03`, which is about 1.5% of the visible range. This produces a thin but clearly visible line.

## The Default Shader

The default code draws two sine waves simultaneously:

- A **primary wave** (blue) with amplitude 0.5 and frequency 1.0
- A **secondary wave** (red) with amplitude 0.3 and frequency 2.0, animated at a different speed

Both waves scroll over time using the `u_time` uniform. A faint horizontal axis line at `y = 0` provides a reference point.

Notice how the two waves have different visual characters despite both being sine waves -- the secondary wave is shorter and more tightly packed due to its higher frequency and lower amplitude.

## Useful Sine Variations

### Normalized Sine (0 to 1)

Often you need a value that oscillates between 0 and 1 rather than -1 and 1. The standard trick is:

```c
float t = 0.5 + 0.5 * sin(x);  // oscillates from 0.0 to 1.0
```

This is extremely common for pulsing colors, alpha values, or any property that should not go negative.

### Cosine

`cos()` is simply a sine wave shifted by PI/2. It starts at 1 when the input is 0, which is sometimes more convenient:

```c
float wave = cos(x);  // same as sin(x + PI/2)
```

### Absolute Sine

`abs(sin(x))` produces a "bouncing" wave that never goes below zero:

```c
float bounce = abs(sin(x));  // always positive, looks like a bouncing ball
```

## Exercises

1. **Change the amplitude** -- Modify the primary wave's amplitude to `0.8` and observe how the wave fills more of the vertical space. Try very small values like `0.1` for subtle oscillations.

2. **Increase the frequency** -- Change the frequency to `4.0` and watch how the wave becomes more tightly packed. Try `0.5` for a very slow, gentle wave.

3. **Pulsing background** -- Replace the static background with `vec3(0.05 + 0.03 * sin(u_time * 3.0))` to create a breathing effect.

4. **Circular sine pattern** -- Instead of using `uv.x` for the wave input, try using `length(uv - vec2(0.5))` to create a circular ripple pattern.

5. **Multiple waves** -- Add a third wave with frequency 3.0 and amplitude 0.15 in a different color. Notice how combining waves creates more complex shapes.

6. **Thickness variation** -- Make the line width vary with position: `float lineWidth = 0.02 + 0.02 * sin(x * 2.0)`. This creates a wave that appears to pulse in thickness.

In the next chapter, we will explore sawtooth and triangle waves, which have sharper shapes and are built using different mathematical techniques.
