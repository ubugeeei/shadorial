#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

vec3 palette(float t) {
  return 0.5 + 0.5 * cos(6.2831 * (t + vec3(0.0, 0.33, 0.67)));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
  float t = u_time * 0.3;

  // Kaleidoscope
  float angle = atan(uv.y, uv.x);
  float segments = 8.0;
  float segAngle = 6.2831 / segments;
  angle = mod(angle + t * 0.2, segAngle);
  angle = abs(angle - segAngle * 0.5);
  float r = length(uv);
  uv = vec2(cos(angle), sin(angle)) * r;

  // Zoom animation
  float scale = 4.0 + sin(t) * 1.0;
  uv *= scale;

  // Domain repetition
  vec2 cellId = floor(uv);
  vec2 cell = fract(uv) - 0.5;

  // Rotate each cell
  float cellAngle = hash(cellId) * 6.28 + t;
  cell = rot(cellAngle) * cell;

  // Draw shapes
  float d = sdBox(cell, vec2(0.25));
  float circle = length(cell) - 0.15;
  d = min(d, circle);

  // Coloring
  float colorIdx = hash(cellId + 0.5) + t * 0.1;
  vec3 shapeColor = palette(colorIdx);

  float edge = smoothstep(0.01, -0.01, d);
  float glow = 0.01 / (abs(d) + 0.01);

  vec3 bg = vec3(0.02, 0.02, 0.04);
  vec3 color = bg;
  color += shapeColor * edge;
  color += shapeColor * glow * 0.15;

  // Center glow
  float centerGlow = 0.03 / (r + 0.03);
  color += vec3(0.3, 0.4, 0.7) * centerGlow * 0.3;

  fragColor = vec4(color, 1.0);
}
