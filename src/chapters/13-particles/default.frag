#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

// Hash functions for pseudo-random values
float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

vec2 hash2(float n) {
  return vec2(hash(n), hash(n + 57.0));
}

vec3 hash3(float n) {
  return vec3(hash(n), hash(n + 57.0), hash(n + 113.0));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;

  vec3 color = vec3(0.02, 0.02, 0.05);

  // Number of particles
  const int NUM_PARTICLES = 80;

  for (int i = 0; i < NUM_PARTICLES; i++) {
    float id = float(i);

    // Pseudo-random initial position (spread across the screen)
    vec2 basePos = hash2(id * 17.31) * 2.0 - 1.0;
    basePos.x *= u_resolution.x / u_resolution.y; // aspect correction

    // Pseudo-random velocity and size
    float speed = 0.1 + hash(id * 7.13) * 0.3;
    float size = 0.004 + hash(id * 3.77) * 0.008;

    // Animate: particles drift upward and wrap around
    float life = mod(u_time * speed + hash(id * 11.0) * 10.0, 2.0);
    vec2 pos = basePos;
    pos.y += life - 1.0; // drift upward
    pos.x += sin(u_time * 0.5 + id) * 0.05; // gentle horizontal sway

    // Wrap vertically
    pos.y = mod(pos.y + 0.6, 1.4) - 0.7;

    // Distance from current pixel to particle center
    float d = length(uv - pos);

    // Glow effect: bright core with soft falloff
    float glow = size / (d * d + 0.0001);
    glow = clamp(glow, 0.0, 3.0);

    // Fade in and out based on life cycle
    float fade = smoothstep(0.0, 0.2, life) * smoothstep(2.0, 1.5, life);

    // Random color per particle (warm palette)
    vec3 particleColor = hash3(id * 31.17);
    particleColor = mix(vec3(0.8, 0.4, 0.1), vec3(0.3, 0.6, 1.0), particleColor.x);
    particleColor = mix(particleColor, vec3(1.0, 0.8, 0.3), particleColor.y * 0.3);

    // Accumulate glow
    color += glow * fade * particleColor * 0.02;
  }

  // Tone mapping (prevent overexposure)
  color = color / (color + 1.0);

  // Subtle vignette
  vec2 vig = gl_FragCoord.xy / u_resolution - 0.5;
  color *= 1.0 - 0.5 * dot(vig, vig);

  fragColor = vec4(color, 1.0);
}
