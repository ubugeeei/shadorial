# Saw & Triangle Wave

While the sine wave is smooth and organic, sawtooth and triangle waves have angular, geometric shapes. These wave types are fundamental in both audio synthesis and shader graphics. They are surprisingly easy to create in GLSL using just `fract()` and `abs()`.

## The Sawtooth Wave

A sawtooth wave ramps linearly from a minimum value to a maximum value, then drops sharply back to the minimum. It looks like the teeth of a saw blade.

### The `fract()` Function

The key to creating a sawtooth wave is `fract()`, which returns the **fractional part** of a number:

```c
fract(0.0)  = 0.0
fract(0.3)  = 0.3
fract(0.9)  = 0.9
fract(1.0)  = 0.0  // wraps back to 0
fract(1.7)  = 0.7
fract(2.5)  = 0.5
fract(-0.3) = 0.7  // note: fract of negative values may surprise you
```

`fract(x)` produces a repeating ramp from 0 to 1 as x increases. This is already a sawtooth wave in the range [0, 1]. To center it around zero:

```c
float saw = fract(x) * 2.0 - 1.0;  // range: [-1, 1]
```

### Controlling the Sawtooth

Just like a sine wave, you can control frequency and animation:

```c
float saw = fract(x * frequency + u_time) * 2.0 - 1.0;
```

The frequency multiplier on `x` controls how many teeth appear across the screen, and `u_time` makes them scroll.

### Why `fract()` Matters

`fract()` is one of the most powerful tools in shader programming beyond just wave generation. It creates **repetition** from any linear input. This is the foundation for:

- Tiling patterns
- Repeating textures
- Grid systems
- Modular arithmetic in shaders

Any time you need to wrap a value back to a repeating range, `fract()` is your tool.

## The Triangle Wave

A triangle wave ramps linearly up, then ramps linearly down, creating a zigzag pattern. It has no sudden jumps like the sawtooth.

### Building the Triangle Wave

The triangle wave can be constructed by taking the absolute value of a centered sawtooth:

```c
float tri = abs(fract(x) * 2.0 - 1.0);  // range: [0, 1]
```

Here is how this works step by step:

1. `fract(x)` produces a ramp from 0 to 1
2. `fract(x) * 2.0` scales it to 0 to 2
3. `fract(x) * 2.0 - 1.0` shifts it to -1 to 1
4. `abs(...)` folds the negative part upward, creating the V shape

To center it around zero (range [-1, 1]):

```c
float tri = abs(fract(x) * 2.0 - 1.0) * 2.0 - 1.0;
```

### Alternative Triangle Wave Construction

You can also build a triangle wave using `mod()`:

```c
float tri = abs(mod(x, 2.0) - 1.0);  // range: [0, 1]
```

`mod(x, 2.0)` produces a sawtooth from 0 to 2, subtracting 1 shifts it to [-1, 1], and `abs()` folds it into a triangle. The result is identical to the `fract()` version.

## Comparing the Wave Shapes

Let us compare all three wave types at a glance:

| Property | Sine | Sawtooth | Triangle |
|---|---|---|---|
| Shape | Smooth curve | Linear ramp with sharp drop | Linear zigzag |
| Function | `sin(x)` | `fract(x) * 2.0 - 1.0` | `abs(fract(x) * 2.0 - 1.0)` |
| Continuity | Smooth (C-infinity) | Discontinuous at transitions | Continuous but has sharp corners |
| Harmonics | Single frequency | Rich in harmonics | Odd harmonics only |

### When to Use Each

- **Sine wave**: Smooth, natural motion. Good for gentle oscillations, organic movement.
- **Sawtooth wave**: Sharp resets. Good for scanning effects, progress bars, repeating ramps.
- **Triangle wave**: Linear back-and-forth. Good for ping-pong animations, symmetric oscillations, linear fading.

## The Default Shader

The default code draws both wave types simultaneously on the same coordinate system:

- **Orange line**: Sawtooth wave using `fract(x) * 2.0 - 1.0`
- **Green line**: Triangle wave using `abs(fract(x) * 2.0 - 1.0) * 2.0 - 1.0`

Both are scaled to half amplitude (`* 0.5`) so they fit comfortably in the visible range, and both are animated with `u_time`. Watch how the sawtooth has sharp vertical jumps while the triangle wave has smooth reversals.

## Practical Applications

### Repeating UV Coordinates

`fract()` is commonly used to tile textures or patterns:

```c
vec2 tiledUV = fract(uv * 4.0);  // 4x4 grid of repeated UVs
```

### Ping-Pong Animation

A triangle wave is perfect for animations that should go back and forth:

```c
float t = abs(fract(u_time * 0.5) * 2.0 - 1.0);  // oscillates 0 to 1 to 0
vec2 pos = mix(startPos, endPos, t);
```

### Gradient Banding

A sawtooth creates repeating gradient bands:

```c
float bands = fract(uv.y * 10.0);  // 10 gradient bands
vec3 color = mix(colorA, colorB, bands);
```

## Exercises

1. **Reverse the sawtooth** -- Create a reversed sawtooth that ramps down instead of up: `1.0 - fract(x)`. Observe how the direction changes.

2. **Variable frequency** -- Make the sawtooth frequency change across the screen: `fract(x * (1.0 + uv.x * 5.0))`. The teeth get denser from left to right.

3. **Sawtooth color bands** -- Use `fract(uv.y * 8.0)` as an input to `mix()` to create horizontal repeating color bands across the full screen.

4. **Triangle wave bounce** -- Animate a circle's y position using a triangle wave: `float y = abs(fract(u_time) * 2.0 - 1.0)`. Draw a circle at that position for a bouncing ball effect.

5. **Combine all three** -- Add a sine wave to the default shader (in a third color) at the same frequency and amplitude. Compare all three shapes side by side.

6. **Staircase wave** -- Create a staircase wave by quantizing a sawtooth: `floor(fract(x) * 4.0) / 4.0`. This creates 4 discrete steps per cycle.

In the next chapter, we will explore pulse waves and the `step()` function, which allow you to create sharp on/off patterns.
