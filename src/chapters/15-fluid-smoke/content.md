# Fluid (Smoke)

Smoke and gaseous fluid simulation creates soft, organic, billowing effects. Unlike water, smoke is volumetric, wispy, and affected by buoyancy and turbulence. In this chapter we combine noise-based advection with density fields to create a convincing smoke effect.

## Density Field

Smoke is represented as a density value at each pixel. Higher density means more opaque smoke:

```c
float density = smoothstep(0.3, 0.0, length(uv - center));
```

This creates a soft circular puff of smoke centered at a point.

## Turbulent Advection

Real smoke swirls and billows. We use FBM (Fractional Brownian Motion) noise to distort the coordinate space before sampling the density:

```c
vec2 offset = vec2(
  fbm(uv * 3.0 + u_time * 0.2),
  fbm(uv * 3.0 + 100.0 + u_time * 0.15)
);
float density = smokeDensity(uv + offset * 0.3);
```

The offset creates the characteristic swirling motion.

## Buoyancy and Rise

Smoke naturally rises due to heat. We simulate this by shifting the UV coordinates upward over time:

```c
uv.y -= u_time * 0.05; // smoke rises
```

## Coloring Smoke

Smoke color transitions from bright at the source to dark and transparent at the edges:

```c
vec3 smokeColor = mix(vec3(0.8), vec3(0.2), density);
float alpha = density * 0.8;
```

## The Default Shader

The default code creates a rising smoke plume using layered FBM noise for turbulence, buoyancy-driven vertical motion, and density-based coloring with soft falloff.

## Exercises

1. **Multiple sources** -- Add several smoke emitters at different positions.
2. **Color temperature** -- Make the smoke transition from warm (orange/red near the source) to cool gray.
3. **Wind** -- Add a horizontal drift by offsetting the x-coordinate over time.
4. **Interaction** -- Use `u_mouse` to push the smoke away from the cursor.
5. **Dissipation** -- Make the smoke gradually fade out as it rises higher.
