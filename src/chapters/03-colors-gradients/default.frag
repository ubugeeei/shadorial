#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // Animated gradient
  vec3 colorA = vec3(0.2, 0.0, 0.5);
  vec3 colorB = vec3(1.0, 0.4, 0.0);
  vec3 colorC = vec3(0.0, 0.8, 0.6);

  float t = uv.x + sin(uv.y * 3.0 + u_time) * 0.2;
  vec3 color = mix(colorA, colorB, smoothstep(0.0, 0.5, t));
  color = mix(color, colorC, smoothstep(0.5, 1.0, t));

  fragColor = vec4(color, 1.0);
}
