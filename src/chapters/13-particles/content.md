# Particles

Traditional particle systems use individual objects with position, velocity, and lifetime. In a fragment shader, we take a different approach: for each pixel, we compute the influence of many virtual particles. This chapter explores **fragment shader particle simulation** using hash-based positioning and glow effects.

## The Fragment Shader Approach

Instead of updating particle positions each frame, we compute them mathematically:

```c
for (int i = 0; i < NUM_PARTICLES; i++) {
  vec2 pos = getParticlePosition(float(i), u_time);
  float d = length(uv - pos);
  color += glow(d);
}
```

Each particle's position is derived from its ID and the current time using deterministic math. No state is stored between frames.

## Hash-Based Positioning

Hash functions convert a particle ID into pseudo-random properties:

```c
float hash(float n) {
  return fract(sin(n) * 43758.5453);
}

vec2 hash2(float n) {
  return vec2(hash(n), hash(n + 57.0));
}
```

Each particle gets a unique starting position, speed, size, and color -- all derived from its integer ID.

## Glow Effects

The classic glow effect uses an inverse-square falloff:

```c
float glow = brightness / (distance * distance + epsilon);
```

The `epsilon` prevents division by zero. This creates a physically-inspired light falloff that looks natural.

## Particle Lifecycle

Particles can fade in and out using their animation phase:

```c
float life = mod(u_time * speed + offset, duration);
float fade = smoothstep(0.0, 0.2, life) * smoothstep(duration, duration * 0.8, life);
```

This creates a smooth fade-in at birth and fade-out at death.

## The Default Shader

The default code renders 80 glowing particles that drift upward with gentle horizontal sway. Each particle has a randomized color from a warm-to-cool palette. Tone mapping (`color / (color + 1.0)`) prevents overexposure where multiple glows overlap.

## Performance Considerations

Each pixel evaluates the distance to every particle, making this O(pixels * particles). Keep particle counts reasonable (50-200) for real-time performance. Spatial partitioning is not easily done in fragment shaders.

## Exercises

1. **Change particle count** -- Increase to 200 or decrease to 20 and observe the visual density and performance impact.

2. **Gravity** -- Add downward acceleration: `pos.y -= 0.5 * time * time;` to simulate falling particles.

3. **Explosion** -- Make all particles originate from a single point and expand outward radially.

4. **Color by speed** -- Assign warmer colors to faster particles and cooler colors to slower ones.

5. **Trail effect** -- For each particle, draw multiple faded copies at previous positions to simulate motion blur.
