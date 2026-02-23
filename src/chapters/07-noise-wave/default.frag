#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

// Hash function: produces a pseudorandom float from a float input
float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

// 1D value noise with linear interpolation
float noise(float x) {
  float i = floor(x);      // integer part
  float f = fract(x);      // fractional part

  // Smooth interpolation curve (cubic Hermite)
  float u = f * f * (3.0 - 2.0 * f);

  // Interpolate between two random values
  return mix(hash(i), hash(i + 1.0), u);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // Map UV coordinates
  float x = uv.x * 8.0;
  float y = uv.y * 2.0 - 1.0;

  // Create a noise-based wave
  float noiseWave = noise(x * 2.0 + u_time) * 0.6 - 0.3;

  // Add a second layer of noise at a different frequency
  noiseWave += noise(x * 5.0 - u_time * 0.7) * 0.2;

  // Draw the noise wave as an anti-aliased line
  float lineWidth = 0.03;
  float dist = abs(y - noiseWave);
  float line = 1.0 - smoothstep(0.0, lineWidth, dist);

  // Draw a smooth sine wave for comparison
  float sineWave = 0.3 * sin(x * 2.0 + u_time);
  float distSine = abs(y - sineWave);
  float lineSine = 1.0 - smoothstep(0.0, lineWidth * 0.7, distSine);

  // Axis line
  float axis = 1.0 - smoothstep(0.0, 0.005, abs(y));

  // Visualize the raw noise values as a subtle background gradient
  float bgNoise = noise(uv.x * 10.0 + u_time * 0.3) * 0.1;

  // Colors
  vec3 bgColor = vec3(0.05 + bgNoise);
  vec3 axisColor = vec3(0.3);
  vec3 noiseColor = vec3(0.4, 0.9, 0.8);   // cyan for noise wave
  vec3 sineColor = vec3(0.3, 0.3, 0.5);    // dim blue for sine reference

  // Compose
  vec3 color = bgColor;
  color = mix(color, axisColor, axis * 0.4);
  color = mix(color, sineColor, lineSine * 0.4);
  color = mix(color, noiseColor, line);

  fragColor = vec4(color, 1.0);
}
