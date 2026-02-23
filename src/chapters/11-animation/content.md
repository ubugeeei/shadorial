# Animation

Everything we have built so far has used `u_time` in some form, but we have not yet studied animation itself as a topic. This chapter focuses on **easing functions** -- the mathematical curves that control *how* values change over time, not just *that* they change.

## Linear Motion

The simplest animation is linear: the value changes at a constant rate.

```c
float t = mod(u_time, duration) / duration; // 0..1 repeating
float x = mix(startX, endX, t);
```

Linear motion is predictable but looks mechanical and unnatural. Real-world objects accelerate and decelerate.

## Easing Functions

An easing function takes a normalized time value `t` (0 to 1) and returns a transformed value, also in the 0 to 1 range but following a different curve. The input `t` always goes from 0 to 1 linearly; the output reshapes the motion.

### Ease In (Acceleration)

Objects start slowly and speed up:

```c
float easeInQuad(float t) {
  return t * t;
}

float easeInCubic(float t) {
  return t * t * t;
}
```

Higher powers create more dramatic acceleration.

### Ease Out (Deceleration)

Objects start fast and slow down:

```c
float easeOutQuad(float t) {
  return t * (2.0 - t);
}
```

This is the "inverse" of ease-in -- the motion curve is flipped.

### Ease In-Out (Both)

Objects accelerate then decelerate, creating smooth natural motion:

```c
float easeInOutCubic(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}
```

### Elastic

Overshoots the target and oscillates like a spring:

```c
float easeOutElastic(float t) {
  return pow(2.0, -10.0 * t) *
    sin((t * 10.0 - 0.75) * (2.0 * PI / 3.0)) + 1.0;
}
```

### Bounce

Simulates a ball bouncing on a surface:

```c
float easeOutBounce(float t) {
  if (t < 1.0 / 2.75) return 7.5625 * t * t;
  else if (t < 2.0 / 2.75) { t -= 1.5/2.75; return 7.5625*t*t + 0.75; }
  // ... more segments for each bounce
}
```

## Looping with mod()

The `mod()` function is essential for creating repeating animations:

```c
float period = 3.0; // seconds per cycle
float t = mod(u_time, period) / period; // 0..1, repeating
```

### Ping-Pong (Back and Forth)

To make an animation go forward then backward:

```c
float t = mod(u_time, period) / period;
t = 1.0 - abs(2.0 * t - 1.0); // triangle wave: 0→1→0
```

## Combining Animations

You can layer multiple animations with different periods to create complex motion:

```c
float x = sin(u_time * 1.0) * 0.3;        // slow horizontal
float y = sin(u_time * 2.5) * 0.1;        // faster vertical
vec2 pos = vec2(x, y);                    // Lissajous-like path
```

## The Default Shader

The default code shows six balls moving across the screen, each using a different easing function:

1. **Red** -- Linear (constant speed)
2. **Orange** -- Ease In Quad (accelerates)
3. **Yellow** -- Ease Out Quad (decelerates)
4. **Green** -- Ease In-Out Cubic (smooth both ends)
5. **Blue** -- Elastic (overshoots and springs)
6. **Purple** -- Bounce (bouncing arrival)

All six balls travel the same distance in the same time. The only difference is the easing function, which dramatically changes how the motion *feels*.

## Exercises

1. **Ease In-Out comparison** -- Replace one lane with `smoothstep(0.0, 1.0, t)`, which is GLSL's built-in ease in-out curve. Compare it to the cubic version.

2. **Ping-pong motion** -- Modify the time calculation so the balls travel left-to-right, then right-to-left, using the triangle wave technique.

3. **Staggered start** -- Add a delay to each lane: `float t = mod(u_time - float(i) * 0.2, period) / period;`. The balls cascade one after another.

4. **Size animation** -- Animate the ball radius using an easing function. Make the balls grow as they move and shrink at the end.

5. **Color transition** -- Animate the ball color from one hue to another over the course of its journey. Use `mix()` with the eased time value.

6. **Custom easing** -- Design your own easing function by combining `sin()`, `pow()`, and other math. Plot it as a curve and apply it to a ball.

In the next chapter, we will explore noise -- the foundation of organic, natural-looking patterns.
