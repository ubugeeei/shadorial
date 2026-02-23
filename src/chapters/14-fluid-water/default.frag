#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

// Simple hash for noise
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Smooth value noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Layered wave function simulating water surface
float waterHeight(vec2 p, float t) {
  float h = 0.0;

  // Layer 1: large slow waves
  h += sin(p.x * 1.5 + t * 0.8) * 0.3;
  h += sin(p.y * 1.2 + t * 0.6) * 0.25;

  // Layer 2: medium waves at an angle
  h += sin(dot(p, vec2(0.7, 0.9)) * 3.0 + t * 1.2) * 0.12;
  h += sin(dot(p, vec2(-0.5, 0.8)) * 4.0 + t * 1.5) * 0.08;

  // Layer 3: fine ripples with noise
  h += noise(p * 6.0 + t * 0.5) * 0.1;
  h += noise(p * 12.0 - t * 0.7) * 0.05;

  return h;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;

  // Scale and center the coordinate space
  vec2 p = vec2(uv.x * aspect, uv.y) * 6.0;
  float t = u_time * 0.6;

  // Compute water height and approximate normal via finite differences
  float eps = 0.05;
  float h = waterHeight(p, t);
  float hx = waterHeight(p + vec2(eps, 0.0), t);
  float hy = waterHeight(p + vec2(0.0, eps), t);

  // Approximate surface normal (for reflections)
  vec3 normal = normalize(vec3((h - hx) / eps, (h - hy) / eps, 1.0));

  // Simple sky color for reflection
  vec3 skyColor = mix(vec3(0.6, 0.75, 0.95), vec3(0.2, 0.4, 0.7), uv.y);

  // Reflection direction (simplified)
  vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
  vec3 reflected = reflect(-viewDir, normal);
  float reflAmount = 0.5 + 0.5 * reflected.y;

  // Deep water color
  vec3 deepColor = vec3(0.02, 0.08, 0.2);
  vec3 shallowColor = vec3(0.05, 0.3, 0.4);

  // Water color varies with height
  float depthFactor = smoothstep(-0.3, 0.4, h);
  vec3 waterColor = mix(deepColor, shallowColor, depthFactor);

  // Mix water with reflected sky
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);
  vec3 color = mix(waterColor, skyColor * 0.8, fresnel * 0.6 + reflAmount * 0.3);

  // Caustic-like patterns (bright spots on the surface)
  float caustic1 = noise(p * 4.0 + t * vec2(0.3, 0.5));
  float caustic2 = noise(p * 5.0 - t * vec2(0.4, 0.2));
  float caustics = pow(caustic1 * caustic2, 2.0) * 3.0;
  color += vec3(0.15, 0.25, 0.2) * caustics;

  // Specular highlights (sun glints)
  float specular = pow(max(reflected.z, 0.0), 64.0);
  color += vec3(1.0, 0.95, 0.8) * specular * 0.6;

  // Subtle foam at wave crests
  float foam = smoothstep(0.3, 0.5, h);
  color = mix(color, vec3(0.8, 0.9, 0.95), foam * 0.3);

  fragColor = vec4(color, 1.0);
}
