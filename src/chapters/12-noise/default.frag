#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

// Hash function for pseudo-random values
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Value noise: smooth random values on a grid
float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  // Smoothstep interpolation (cubic Hermite)
  vec2 u = f * f * (3.0 - 2.0 * f);

  // Four corner values
  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  // Bilinear interpolation
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Fractal Brownian Motion: layered noise at increasing frequencies
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;

  // Sum 6 octaves of noise
  for (int i = 0; i < 6; i++) {
    value += amplitude * valueNoise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;

  float t = u_time * 0.3;

  // Domain warping: use FBM to distort the input of another FBM
  vec2 q = vec2(
    fbm(uv * 3.0 + vec2(0.0, 0.0) + t * 0.4),
    fbm(uv * 3.0 + vec2(5.2, 1.3) + t * 0.3)
  );

  vec2 r = vec2(
    fbm(uv * 3.0 + 4.0 * q + vec2(1.7, 9.2) + t * 0.15),
    fbm(uv * 3.0 + 4.0 * q + vec2(8.3, 2.8) + t * 0.12)
  );

  float f = fbm(uv * 3.0 + 4.0 * r);

  // Color mapping: map the noise value to a rich color palette
  vec3 color = mix(vec3(0.05, 0.02, 0.15), vec3(0.1, 0.3, 0.6), f);
  color = mix(color, vec3(0.8, 0.4, 0.1), dot(q, q) * 0.8);
  color = mix(color, vec3(0.95, 0.85, 0.6), r.x * r.y * 0.6);

  // Subtle vignette
  vec2 center = gl_FragCoord.xy / u_resolution - 0.5;
  float vignette = 1.0 - 0.4 * dot(center, center);
  color *= vignette;

  fragColor = vec4(color, 1.0);
}
