# Colors & Gradients

Color is the most fundamental output of a fragment shader. In this chapter, we will explore how colors work in depth, learn powerful functions for blending and transitioning between colors, and discover techniques for creating beautiful gradients.

## The RGB Color Model in Shaders

As we learned in Chapter 1, colors in GLSL are represented as vectors with values ranging from `0.0` to `1.0`. This is different from CSS or most design tools, where colors are typically expressed as integers from 0 to 255.

To convert a familiar color to GLSL, simply divide each component by 255:

```c
// CSS: rgb(64, 128, 255)
// GLSL:
vec3 color = vec3(64.0/255.0, 128.0/255.0, 255.0/255.0);
// which is approximately:
vec3 color = vec3(0.251, 0.502, 1.0);
```

You can also construct colors from a single value for grayscale:

```c
vec3 gray = vec3(0.5);  // same as vec3(0.5, 0.5, 0.5)
```

### Color Arithmetic

Since colors are just vectors, you can perform arithmetic on them:

```c
vec3 a = vec3(1.0, 0.0, 0.0);  // red
vec3 b = vec3(0.0, 0.0, 1.0);  // blue
vec3 c = a + b;                  // vec3(1.0, 0.0, 1.0) = magenta
vec3 d = a * 0.5;               // vec3(0.5, 0.0, 0.0) = dark red
```

Multiplying two colors together produces a **multiply blend** (the same as the "Multiply" blend mode in Photoshop):

```c
vec3 e = vec3(1.0, 0.5, 0.5) * vec3(0.5, 1.0, 0.5);
// = vec3(0.5, 0.5, 0.25)
```

## The `mix()` Function

`mix()` is the go-to function for blending between two values. It performs **linear interpolation** (also called "lerp"):

```c
vec3 result = mix(colorA, colorB, t);
```

This is equivalent to:

```c
vec3 result = colorA * (1.0 - t) + colorB * t;
```

When `t = 0.0`, the result is `colorA`. When `t = 1.0`, the result is `colorB`. Values in between give a smooth blend.

The beauty of `mix()` is that `t` can be anything — a UV coordinate, a sine wave, a distance value, or any other float. This makes it incredibly versatile for creating gradients.

### Simple Horizontal Gradient

```c
vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), uv.x);
```

This creates a gradient from red on the left to blue on the right, because `uv.x` goes from 0 to 1 across the screen.

### Simple Vertical Gradient

```c
vec3 color = mix(vec3(0.0), vec3(1.0), uv.y);
```

A gradient from black at the bottom to white at the top.

## `smoothstep()` for Smooth Transitions

While `mix()` with a raw UV coordinate creates a **linear** gradient, `smoothstep()` gives you control over **where** and **how sharply** the transition occurs.

Recall from Chapter 2:

```c
float t = smoothstep(edge0, edge1, x);
```

By wrapping your interpolation parameter in `smoothstep()`, you get an S-shaped curve instead of a straight line:

```c
// Linear gradient across the full width
vec3 linear = mix(colorA, colorB, uv.x);

// Gradient concentrated in the middle
vec3 smooth = mix(colorA, colorB, smoothstep(0.3, 0.7, uv.x));
```

The second version transitions only between `x = 0.3` and `x = 0.7`, with solid colors on either side.

## Linear vs. Smooth Gradients

The difference between linear and smooth gradients is subtle but important:

- **Linear gradient**: The color changes at a constant rate. Created with `mix(a, b, t)`.
- **Smooth gradient**: The color changes slowly at the start and end, and faster in the middle. Created with `mix(a, b, smoothstep(0.0, 1.0, t))`.

The smooth version often looks more natural because it avoids harsh transitions at the boundaries. This is especially noticeable when combining multiple gradient stops.

## Multi-Stop Gradients

To create a gradient with more than two colors, chain multiple `mix()` calls with appropriate `smoothstep()` ranges:

```c
vec3 colorA = vec3(0.2, 0.0, 0.5);  // purple
vec3 colorB = vec3(1.0, 0.4, 0.0);  // orange
vec3 colorC = vec3(0.0, 0.8, 0.6);  // teal

float t = uv.x;
vec3 color = mix(colorA, colorB, smoothstep(0.0, 0.5, t));
color = mix(color, colorC, smoothstep(0.5, 1.0, t));
```

This produces a three-color gradient: purple on the left, transitioning to orange in the middle, then to teal on the right.

The default code in this chapter uses exactly this technique, with an added sine-wave distortion to make the gradient boundaries wave up and down:

```c
float t = uv.x + sin(uv.y * 3.0 + u_time) * 0.2;
```

The `sin(uv.y * 3.0 + u_time) * 0.2` part shifts the gradient boundary based on the y position and time, creating an animated wavy gradient.

## HSV/HSL Color Spaces

RGB is not the most intuitive way to think about color. **HSV** (Hue, Saturation, Value) and **HSL** (Hue, Saturation, Lightness) are alternative color spaces that are often more useful for procedural color generation.

- **Hue** (0.0 - 1.0): The color itself — red, orange, yellow, green, blue, purple, and back to red.
- **Saturation** (0.0 - 1.0): How vivid the color is. 0 is grayscale, 1 is fully saturated.
- **Value/Lightness** (0.0 - 1.0): How bright the color is. 0 is black, 1 is the brightest.

GLSL does not have built-in HSV functions, but the conversion is straightforward. Here is a commonly used HSV-to-RGB function:

```c
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
```

With this function, creating a rainbow is trivial:

```c
vec3 rainbow = hsv2rgb(vec3(uv.x, 1.0, 1.0));
```

This sweeps through all hues from left to right at full saturation and brightness.

### Animated Rainbow

```c
vec3 color = hsv2rgb(vec3(uv.x + u_time * 0.1, 0.8, 0.9));
```

By adding `u_time` to the hue, the rainbow scrolls smoothly over time.

## Radial Gradients

Instead of using `uv.x` or `uv.y` as the gradient parameter, you can use the distance from a center point:

```c
vec2 center = vec2(0.5);
float dist = length(uv - center);
vec3 color = mix(vec3(1.0, 1.0, 0.0), vec3(0.0, 0.0, 0.5), dist);
```

This creates a radial gradient from yellow at the center to dark blue at the edges. You can apply `smoothstep()` to control the falloff:

```c
float t = smoothstep(0.0, 0.5, dist);
vec3 color = mix(innerColor, outerColor, t);
```

## Exercises

Try these experiments to practice working with colors and gradients:

1. **Create a rainbow** — Add the `hsv2rgb` function to your shader and use `hsv2rgb(vec3(uv.x, 1.0, 1.0))` as your color. Then animate it by adding `u_time * 0.1` to the hue.

2. **Radial gradient** — Replace the default gradient with a radial one using `length(uv - vec2(0.5))` as your interpolation parameter. Make it go from a warm color in the center to a cool color at the edges.

3. **Animated color palette** — Create a palette that cycles through different color schemes using `u_time`. Use `sin(u_time)` to animate the colors in your `mix()` calls.

4. **Four-corner gradient** — Use two `mix()` calls to blend four colors, one for each corner: `mix(mix(bottomLeft, bottomRight, uv.x), mix(topLeft, topRight, uv.x), uv.y)`.

5. **Concentric rings** — Use `sin(length(uv - vec2(0.5)) * 30.0)` as a color parameter to create concentric colored rings.

6. **Diagonal gradient with wave** — Modify the default code to use `(uv.x + uv.y) * 0.5` as the base gradient direction instead of just `uv.x`.

In the next chapter, we will explore the sine wave in much greater depth and learn how to create wave patterns and oscillations.
