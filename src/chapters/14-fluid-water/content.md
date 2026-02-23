# Fluid (Water)

Water is one of the most visually rewarding effects in shader programming. In this chapter, we simulate a water surface using layered sine waves, procedural noise, and simplified reflection and refraction. The result is an animated, reflective water surface with caustic-like light patterns.

## Layered Waves

Real water surfaces are the sum of many waves at different scales. We layer multiple sine waves with different frequencies, directions, and speeds:

```c
float waterHeight(vec2 p, float t) {
  float h = 0.0;
  h += sin(p.x * 1.5 + t * 0.8) * 0.3;       // large slow wave
  h += sin(dot(p, vec2(0.7, 0.9)) * 3.0 + t) * 0.12; // angled wave
  h += noise(p * 6.0 + t * 0.5) * 0.1;        // fine noise ripples
  return h;
}
```

The `dot(p, direction)` trick creates waves traveling at an angle rather than along a single axis.

## Surface Normals from Height

To compute lighting and reflections, we need the surface normal. We approximate it using **finite differences**:

```c
float eps = 0.05;
float hx = waterHeight(p + vec2(eps, 0.0), t);
float hy = waterHeight(p + vec2(0.0, eps), t);
vec3 normal = normalize(vec3((h - hx) / eps, (h - hy) / eps, 1.0));
```

This samples the height at two nearby points and computes the slope.

## Reflection and Fresnel

Water is more reflective at shallow viewing angles (Fresnel effect):

```c
float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);
vec3 color = mix(waterColor, skyColor, fresnel);
```

When looking straight down, you see the water color. At a glancing angle, you see reflected sky.

## Caustic Patterns

Caustics are the bright, rippling light patterns seen at the bottom of a pool. We approximate them by multiplying two offset noise layers:

```c
float caustic = pow(noise(p * 4.0 + t) * noise(p * 5.0 - t), 2.0);
```

The multiplication and power function create bright concentrated spots.

## The Default Shader

The default code combines all of these techniques: layered waves for the surface shape, finite-difference normals for lighting, Fresnel-based sky reflection, caustic patterns, specular sun glints, and foam at wave crests.

## Exercises

1. **Wave parameters** -- Modify the wave frequencies and amplitudes. More layers with smaller amplitudes create a more realistic ocean.

2. **Color depth** -- Vary the water color based on the height value to show shallow vs. deep water.

3. **Foam lines** -- Increase the foam threshold or add noise to the foam boundary for a more natural coastline look.

4. **Day and night** -- Change the sky color to sunset or night tones and observe how the water reflections change.

5. **Ripple interaction** -- Add a circular ripple centered at a fixed point: `h += sin(length(p - center) * 10.0 - t * 5.0) * exp(-length(p - center));`
