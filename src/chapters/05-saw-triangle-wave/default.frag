#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // Map UV coordinates
  float x = uv.x * 6.0 + u_time;   // scale and animate
  float y = uv.y * 2.0 - 1.0;      // map y to [-1, 1]

  // --- Sawtooth wave ---
  // fract() returns the fractional part, creating a 0-to-1 ramp
  float saw = fract(x) * 2.0 - 1.0;  // map to [-1, 1]

  // --- Triangle wave ---
  // abs(fract(x) * 2.0 - 1.0) creates a V shape, then scale to [-1, 1]
  float tri = abs(fract(x) * 2.0 - 1.0) * 2.0 - 1.0;

  // Line rendering parameters
  float lineWidth = 0.03;

  // Distance from pixel to each wave curve
  float distSaw = abs(y - saw * 0.5);
  float distTri = abs(y - tri * 0.5);

  // Anti-aliased lines
  float lineSaw = 1.0 - smoothstep(0.0, lineWidth, distSaw);
  float lineTri = 1.0 - smoothstep(0.0, lineWidth, distTri);

  // Axis line
  float axis = 1.0 - smoothstep(0.0, 0.005, abs(y));

  // Colors
  vec3 bgColor = vec3(0.05);
  vec3 axisColor = vec3(0.3);
  vec3 sawColor = vec3(1.0, 0.5, 0.1);   // orange for sawtooth
  vec3 triColor = vec3(0.3, 0.9, 0.5);   // green for triangle

  // Compose the final color
  vec3 color = bgColor;
  color = mix(color, axisColor, axis * 0.5);
  color = mix(color, sawColor, lineSaw);
  color = mix(color, triColor, lineTri);

  fragColor = vec4(color, 1.0);
}
