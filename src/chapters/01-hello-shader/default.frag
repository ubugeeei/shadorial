#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  fragColor = vec4(uv.x, uv.y, 0.5, 1.0);
}
