# Hello Shader

Welcome to the world of shaders! In this first chapter, you will learn the very basics of fragment shaders — the tiny programs that determine the color of every single pixel on your screen.

## What Is a Fragment Shader?

A **fragment shader** (also called a **pixel shader**) is a small program that runs on your GPU (Graphics Processing Unit). Its job is simple but powerful: for every pixel that needs to be drawn, the fragment shader decides what color that pixel should be.

Unlike code that runs on a CPU (which processes things one at a time, or a few at a time), a fragment shader runs **in parallel** across thousands of pixels simultaneously. This is what makes GPUs so fast at rendering graphics.

Think of it this way: imagine you have a huge canvas of pixels, and you hire one tiny painter for each pixel. You give every painter the **same set of instructions** (the shader code), and they all paint at the same time. Each painter only knows their own position on the canvas and some shared information (uniforms), but they cannot communicate with each other.

## The Graphics Pipeline (Brief Overview)

When something is drawn on screen using a GPU, the data flows through a series of stages called the **graphics pipeline**:

1. **Vertex Shader** — Processes each vertex (corner point) of a shape. It handles position, transformation, and projection.
2. **Rasterization** — The GPU figures out which pixels fall inside each triangle formed by the vertices.
3. **Fragment Shader** — For each of those pixels (fragments), the fragment shader runs and outputs a color.
4. **Output** — The final colors are written to the screen buffer.

In this tutorial series, we focus almost entirely on the **fragment shader** stage. We render a full-screen quad (two triangles that cover the entire viewport), so the fragment shader runs once for every pixel on the canvas.

## `gl_FragCoord` and UV Coordinates

Every fragment shader has access to a special built-in variable called `gl_FragCoord`. This gives you the **pixel coordinates** of the current fragment:

- `gl_FragCoord.x` — the horizontal pixel position (0 at the left edge)
- `gl_FragCoord.y` — the vertical pixel position (0 at the bottom edge)

These values are in **pixel units**, so if your canvas is 800x600 pixels, `gl_FragCoord.x` ranges from 0 to 800 and `gl_FragCoord.y` ranges from 0 to 600.

To make our code resolution-independent, we **normalize** these coordinates by dividing by the canvas resolution:

```c
vec2 uv = gl_FragCoord.xy / u_resolution;
```

Now `uv` is a `vec2` (a 2D vector) where:

- `uv.x` goes from `0.0` (left) to `1.0` (right)
- `uv.y` goes from `0.0` (bottom) to `1.0` (top)

These normalized coordinates are commonly called **UV coordinates**. They are extremely useful because your shader will look the same regardless of the canvas size.

## How Colors Work in Shaders

In GLSL (the shader language), colors are represented as vectors with 4 components:

```c
vec4(red, green, blue, alpha)
```

Each component is a floating-point number in the range `0.0` to `1.0`:

| Component | Meaning                        | 0.0          | 1.0          |
|-----------|--------------------------------|--------------|--------------|
| Red       | Amount of red                  | No red       | Full red     |
| Green     | Amount of green                | No green     | Full green   |
| Blue      | Amount of blue                 | No blue      | Full blue    |
| Alpha     | Opacity (transparency)         | Transparent  | Fully opaque |

Some common colors:

- `vec4(1.0, 0.0, 0.0, 1.0)` — Red
- `vec4(0.0, 1.0, 0.0, 1.0)` — Green
- `vec4(0.0, 0.0, 1.0, 1.0)` — Blue
- `vec4(1.0, 1.0, 1.0, 1.0)` — White
- `vec4(0.0, 0.0, 0.0, 1.0)` — Black
- `vec4(1.0, 1.0, 0.0, 1.0)` — Yellow (red + green)

## Understanding the Default Code

Let's walk through the default shader code line by line:

```c
#version 300 es
precision highp float;
```

These first two lines declare the GLSL version (WebGL 2 / OpenGL ES 3.0) and set the floating-point precision to high.

```c
out vec4 fragColor;
```

This declares the output variable. The color we assign to `fragColor` becomes the pixel's final color.

```c
uniform vec2 u_resolution;
```

A **uniform** is a value passed in from the application (JavaScript side). `u_resolution` contains the width and height of the canvas in pixels. We will learn more about uniforms in the next chapter.

```c
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  fragColor = vec4(uv.x, uv.y, 0.5, 1.0);
}
```

In `main()`:

1. We compute normalized UV coordinates.
2. We set the output color so that:
   - **Red** increases from left to right (`uv.x`)
   - **Green** increases from bottom to top (`uv.y`)
   - **Blue** is fixed at `0.5`
   - **Alpha** is `1.0` (fully opaque)

The result is a beautiful gradient: dark in the bottom-left corner, red on the right, green at the top, and yellowish in the top-right where both red and green are at their maximum.

## Exercises

Now it is your turn! Try modifying the default code and observe what happens:

1. **Swap the color channels** — Use `vec4(uv.y, uv.x, 0.5, 1.0)` to swap the red and green gradients. What changes?

2. **Multiply UV components** — Replace the color with `vec4(uv.x * uv.y, uv.x * uv.y, uv.x * uv.y, 1.0)`. This creates a grayscale gradient. Why does the corner stay dark?

3. **Use a two-component shorthand** — Try `vec4(uv, 1.0, 1.0)`. GLSL lets you use a `vec2` as the first two components of a `vec4`. What color do you see?

4. **Make it all one color** — Try `vec4(0.0, 0.5, 1.0, 1.0)` to fill the entire screen with a single color. Experiment with different values.

5. **Invert the gradient** — Try `vec4(1.0 - uv.x, 1.0 - uv.y, 0.5, 1.0)`. How does the gradient direction change?

6. **Create a diagonal gradient** — Use `float d = (uv.x + uv.y) / 2.0;` and then `vec4(d, d, d, 1.0)` for a diagonal grayscale gradient.

In the next chapter, we will explore **uniforms** in more depth and learn how to add animation and mouse interaction to our shaders.
