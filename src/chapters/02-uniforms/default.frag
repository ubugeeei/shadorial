#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 mouse = u_mouse / u_resolution;

  float r = 0.5 + 0.5 * sin(u_time);
  float g = 0.5 + 0.5 * sin(u_time + 2.094);
  float b = 0.5 + 0.5 * sin(u_time + 4.189);

  float dist = length(uv - mouse);
  float circle = smoothstep(0.15, 0.14, dist);

  fragColor = vec4(vec3(r, g, b) * (0.3 + circle * 0.7), 1.0);
}
