# Uniforms

In the previous chapter, we wrote a static shader that produced a fixed gradient. In this chapter, we will bring our shaders to life by learning about **uniforms** — the bridge between your application (JavaScript) and your shader (GLSL).

## What Are Uniforms?

A **uniform** is a variable whose value is set from outside the shader, typically by your JavaScript/TypeScript code. The word "uniform" means the value is the **same for every pixel** during a single draw call.

Unlike `gl_FragCoord`, which is different for each pixel, a uniform holds one consistent value shared across all fragments. This makes uniforms perfect for passing in global information like time, resolution, and mouse position.

You declare uniforms at the top of your shader, outside the `main()` function:

```c
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
```

In this playground, three uniforms are automatically provided for you:

| Uniform        | Type    | Description                                    |
|----------------|---------|------------------------------------------------|
| `u_time`       | `float` | Seconds elapsed since the shader started       |
| `u_resolution` | `vec2`  | Canvas width and height in pixels               |
| `u_mouse`      | `vec2`  | Current mouse position in pixels                |

## `u_time` — Animating with Time

`u_time` is a floating-point number that increases continuously (in seconds). By using it in mathematical expressions, you can create animation.

The simplest animation uses the `sin()` (sine) function:

```c
float value = sin(u_time);
```

The sine function oscillates between `-1.0` and `1.0`. To convert this to a `0.0` to `1.0` range (which is useful for colors), we use a common trick:

```c
float value = 0.5 + 0.5 * sin(u_time);
```

This maps `sin(u_time)` from `[-1, 1]` to `[0, 1]`:
- When `sin(u_time) = -1.0` → `0.5 + 0.5 * (-1.0) = 0.0`
- When `sin(u_time) = 1.0` → `0.5 + 0.5 * 1.0 = 1.0`

To control the **speed** of the animation, multiply `u_time` by a factor:

```c
float fast = 0.5 + 0.5 * sin(u_time * 3.0);  // 3x faster
float slow = 0.5 + 0.5 * sin(u_time * 0.5);  // half speed
```

## The `sin()` Function for Color Cycling

In the default code, we create a rainbow color cycle by using three sine waves with different **phase offsets**:

```c
float r = 0.5 + 0.5 * sin(u_time);
float g = 0.5 + 0.5 * sin(u_time + 2.094);
float b = 0.5 + 0.5 * sin(u_time + 4.189);
```

The offsets `2.094` and `4.189` are approximately `2π/3` and `4π/3` (one-third and two-thirds of a full circle). This spaces the red, green, and blue waves evenly around the cycle, producing a smooth rainbow effect as time progresses.

## `u_resolution` — Resolution-Independent Coordinates

As we learned in the previous chapter, dividing `gl_FragCoord.xy` by `u_resolution` gives us normalized UV coordinates from 0 to 1. Without this normalization, your shader would look different at different canvas sizes.

```c
vec2 uv = gl_FragCoord.xy / u_resolution;
```

Sometimes you want to maintain the **aspect ratio** so circles do not appear as ovals. You can do this by adjusting the x coordinate:

```c
vec2 uv = gl_FragCoord.xy / u_resolution;
uv.x *= u_resolution.x / u_resolution.y; // correct aspect ratio
```

## `u_mouse` — Mouse Interaction

`u_mouse` contains the current mouse position in pixel coordinates. Like `gl_FragCoord`, we normalize it by dividing by the resolution:

```c
vec2 mouse = u_mouse / u_resolution;
```

Now `mouse` is in the same `[0, 1]` coordinate space as `uv`, making it easy to compare positions and calculate distances.

## `length()` — Measuring Distance

The `length()` function returns the magnitude (length) of a vector. When applied to the difference of two points, it gives the **Euclidean distance** between them:

```c
float dist = length(uv - mouse);
```

This calculates how far each pixel is from the mouse cursor. Pixels close to the mouse will have a small `dist` value; pixels far away will have a large one.

## `smoothstep()` — Smooth Thresholds

`smoothstep(edge0, edge1, x)` is one of the most useful functions in shader programming. It returns:

- `0.0` when `x <= edge0`
- `1.0` when `x >= edge1`
- A smooth curve between `0.0` and `1.0` when `x` is between `edge0` and `edge1`

In the default code:

```c
float circle = smoothstep(0.15, 0.14, dist);
```

Notice that `edge0 > edge1` here. When the first argument is larger than the second, `smoothstep` effectively **inverts** the transition: it returns `1.0` when `dist` is small (inside the circle) and `0.0` when `dist` is large (outside the circle). The thin band between `0.14` and `0.15` creates the smooth edge of the circle.

## Understanding the Default Code

Let's put it all together:

```c
vec3(r, g, b) * (0.3 + circle * 0.7)
```

- Outside the circle, `circle = 0.0`, so the brightness is `0.3` — a dim version of the cycling color.
- Inside the circle, `circle = 1.0`, so the brightness is `0.3 + 0.7 = 1.0` — full brightness.
- The result is a glowing circle that follows your mouse, with rainbow colors cycling over time and a dimmed background.

## Exercises

Try these modifications to deepen your understanding:

1. **Change the animation speed** — Multiply `u_time` by `3.0` or `0.2` in the sine functions. How does it feel?

2. **Make the circle larger or smaller** — Change the `smoothstep` values (e.g., `smoothstep(0.3, 0.29, dist)` for a bigger circle).

3. **Create multiple circles** — Add a second circle at a fixed position: `float circle2 = smoothstep(0.1, 0.09, length(uv - vec2(0.5, 0.5)));` and combine them with `max(circle, circle2)`.

4. **Make the circle pulse** — Use `u_time` to animate the circle radius: `float radius = 0.1 + 0.05 * sin(u_time * 2.0);`

5. **Change the edge softness** — Try `smoothstep(0.2, 0.05, dist)` for a very soft, glowing edge vs `smoothstep(0.15, 0.149, dist)` for a razor-sharp edge.

6. **Create a ring** — Combine two smoothsteps: `float ring = smoothstep(0.2, 0.19, dist) - smoothstep(0.15, 0.14, dist);`

In the next chapter, we will dive deep into color theory and gradient techniques.
