# Pulse Wave

A pulse wave (also called a rectangular wave or square wave) alternates between two fixed values -- typically "on" and "off." It is the simplest wave shape: flat on top, flat on the bottom, with instant transitions between them. The `step()` function is the key tool for creating pulse waves in GLSL.

## The `step()` Function

`step()` is a threshold function that returns 0 or 1:

```c
float result = step(edge, x);
// Returns 0.0 if x < edge
// Returns 1.0 if x >= edge
```

Think of it as a hard cutoff. Everything below the edge is 0, everything at or above is 1. There is no smooth transition -- it is an instant, binary decision.

```c
step(0.5, 0.3)  // = 0.0 (0.3 is below the 0.5 threshold)
step(0.5, 0.7)  // = 1.0 (0.7 is above the 0.5 threshold)
step(0.5, 0.5)  // = 1.0 (equal to the edge counts as above)
```

### `step()` vs `smoothstep()`

In the previous chapters, we used `smoothstep()` for gradual transitions. `step()` is its sharp counterpart:

```c
// Hard edge -- instant transition
float hard = step(0.5, uv.x);

// Soft edge -- smooth transition between 0.4 and 0.6
float soft = smoothstep(0.4, 0.6, uv.x);
```

Choose `step()` when you want a crisp boundary. Choose `smoothstep()` when you want a gentle blend.

## Building a Pulse Wave

To create a repeating pulse wave, combine `step()` with `fract()`:

```c
float pulse = step(0.5, fract(x));
```

Here is how this works:

1. `fract(x)` creates a repeating sawtooth from 0 to 1
2. `step(0.5, ...)` converts it into a repeating 0/1 pattern

When the sawtooth is below 0.5, the output is 0. When it reaches 0.5, the output jumps to 1. When the sawtooth resets at the next integer, the output drops back to 0.

The result is a square wave with 50% duty cycle -- it spends equal time in the "on" and "off" states.

## Duty Cycle

The **duty cycle** is the fraction of each period that the wave spends in the "on" (high) state. By changing the threshold in `step()`, you control the duty cycle:

```c
float duty = 0.3;
float pulse = step(duty, fract(x));
```

- `duty = 0.5`: Classic square wave (50% on, 50% off)
- `duty = 0.1`: Short pulses with long gaps (10% on, 90% off)
- `duty = 0.9`: Long pulses with short gaps (90% on, 10% off)

The duty cycle is a powerful parameter for creating varied rhythmic patterns from a single wave function.

### Animated Duty Cycle

In the default shader, the duty cycle oscillates over time:

```c
float duty = 0.5 + 0.3 * sin(u_time * 0.8);
```

This produces a duty cycle that smoothly varies between 0.2 and 0.8, making the pulse width visually "breathe."

## The Default Shader

The default code draws a pulse wave as a line, including both horizontal and vertical segments. Drawing a pulse wave as a line is slightly more complex than a sine wave because the pulse has **vertical transitions** (the rising and falling edges) that need to be rendered as vertical line segments.

The shader also includes:

- A subtle grid pattern in the background for visual reference
- A colored bar at the bottom showing the current duty cycle value
- An axis line at y = 0

## Creating Patterns with Pulse Waves

Pulse waves are incredibly useful for creating structured patterns:

### Stripe Pattern

```c
float stripes = step(0.5, fract(uv.x * 10.0));
vec3 color = mix(colorA, colorB, stripes);
```

This creates 10 vertical stripes alternating between two colors.

### Checkerboard

Combine two perpendicular pulse waves:

```c
float checkX = step(0.5, fract(uv.x * 8.0));
float checkY = step(0.5, fract(uv.y * 8.0));
float checker = mod(checkX + checkY, 2.0);
vec3 color = mix(vec3(0.0), vec3(1.0), checker);
```

### Dotted Line

Use a pulse wave on one axis combined with a distance check:

```c
float pulse = step(0.5, fract(uv.x * 20.0));
float line = step(abs(uv.y - 0.5), 0.01);
float dottedLine = pulse * line;
```

### Brick Pattern

Offset alternating rows to create a brick-like pattern:

```c
float row = floor(uv.y * 8.0);
float offsetX = uv.x + mod(row, 2.0) * 0.5;  // shift every other row
float brickX = step(0.05, fract(offsetX * 4.0));
float brickY = step(0.05, fract(uv.y * 8.0));
float brick = min(brickX, brickY);
```

## `step()` for Masking

Beyond waves, `step()` is frequently used to create masks -- regions that include or exclude parts of the image:

```c
// Mask: only the left half of the screen
float mask = step(uv.x, 0.5);

// Mask: inside a circle of radius 0.3
float mask = 1.0 - step(0.3, length(uv - vec2(0.5)));
```

You can multiply any color by a mask to restrict it to a region.

## Combining `step()` for Ranges

To check if a value is within a range, use two `step()` calls:

```c
// Returns 1.0 when x is between 0.3 and 0.7
float inRange = step(0.3, x) * (1.0 - step(0.7, x));
// Equivalent to: step(0.3, x) - step(0.7, x)
```

This is the foundation for creating bars, bands, and bounded regions.

## Exercises

1. **Change the duty cycle** -- Set the duty cycle to a fixed value of `0.2` and observe the narrow pulses. Then try `0.8` for wide pulses.

2. **Vertical stripes** -- Remove the wave line and instead use `step(0.5, fract(uv.x * 10.0))` to fill the entire screen with alternating black and white stripes.

3. **Checkerboard** -- Implement the checkerboard pattern described above. Try different grid sizes.

4. **PWM color mixing** -- Use different duty cycles for R, G, and B channels to create colors: `vec3(step(0.3, fract(x)), step(0.5, fract(x)), step(0.7, fract(x)))`.

5. **Animated barcode** -- Create a pattern of vertical stripes with varying widths by using multiple `step()` calls with different thresholds. Animate them with `u_time`.

6. **Soft pulse wave** -- Replace `step()` with `smoothstep()` to create a pulse wave with smooth transitions instead of sharp edges. Compare the visual difference.

In the next chapter, we will explore noise-based waves, which break away from regular, predictable patterns.
