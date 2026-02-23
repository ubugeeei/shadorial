#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;

  float t = u_time * 0.3;

  // Smoke source at bottom center
  vec2 center = vec2(aspect * 0.5, 0.1);

  // Buoyancy: shift upward over time
  vec2 p = uv;
  p.y -= t * 0.15;

  // Turbulent advection using FBM
  vec2 offset = vec2(
    fbm(p * 3.0 + t * 0.4),
    fbm(p * 3.0 + 100.0 + t * 0.3)
  );
  vec2 distorted = p + offset * 0.25;

  // Density based on distance from source column
  float dist = abs(distorted.x - center.x);
  float vertFade = smoothstep(0.0, 0.8, uv.y);
  float density = smoothstep(0.35, 0.0, dist) * (1.0 - vertFade);

  // Add noise detail to density
  density *= fbm(distorted * 5.0 + t) * 1.5 + 0.2;
  density = clamp(density, 0.0, 1.0);

  // Color: warm near source, cool gray higher up
  vec3 warmColor = vec3(0.9, 0.6, 0.3);
  vec3 coolColor = vec3(0.6, 0.6, 0.65);
  vec3 smokeColor = mix(warmColor, coolColor, uv.y);

  // Background
  vec3 bg = vec3(0.02, 0.02, 0.04);
  vec3 color = mix(bg, smokeColor, density * 0.85);

  fragColor = vec4(color, 1.0);
}
