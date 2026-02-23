#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // Map UV coordinates
  float x = uv.x * 8.0;
  float y = uv.y * 2.0 - 1.0;

  float lineWidth = 0.025;

  // --- Individual harmonics ---
  // Fundamental frequency (1st harmonic)
  float h1 = sin(x + u_time);

  // 3rd harmonic (1/3 amplitude, 3x frequency)
  float h3 = sin(3.0 * x + u_time * 1.5) / 3.0;

  // 5th harmonic (1/5 amplitude, 5x frequency)
  float h5 = sin(5.0 * x + u_time * 2.0) / 5.0;

  // 7th harmonic (1/7 amplitude, 7x frequency)
  float h7 = sin(7.0 * x + u_time * 2.5) / 7.0;

  // --- Composite wave (sum of harmonics) ---
  // This approximates a square wave as more harmonics are added
  float composite = (h1 + h3 + h5 + h7) * 0.5;

  // Draw each harmonic as a faint line
  float lineH1 = 1.0 - smoothstep(0.0, lineWidth, abs(y - h1 * 0.4));
  float lineH3 = 1.0 - smoothstep(0.0, lineWidth * 0.7, abs(y - h3 * 0.4));
  float lineH5 = 1.0 - smoothstep(0.0, lineWidth * 0.7, abs(y - h5 * 0.4));
  float lineH7 = 1.0 - smoothstep(0.0, lineWidth * 0.7, abs(y - h7 * 0.4));

  // Draw the composite wave as a bright line
  float lineComposite = 1.0 - smoothstep(0.0, lineWidth, abs(y - composite));

  // Axis line
  float axis = 1.0 - smoothstep(0.0, 0.005, abs(y));

  // Colors for each harmonic
  vec3 bgColor = vec3(0.05);
  vec3 axisColor = vec3(0.25);
  vec3 h1Color = vec3(0.3, 0.3, 0.6);   // dim blue
  vec3 h3Color = vec3(0.3, 0.5, 0.3);   // dim green
  vec3 h5Color = vec3(0.5, 0.3, 0.3);   // dim red
  vec3 h7Color = vec3(0.4, 0.4, 0.2);   // dim yellow
  vec3 compColor = vec3(1.0, 0.8, 0.3);  // bright gold for composite

  // Compose the final color
  vec3 color = bgColor;
  color = mix(color, axisColor, axis * 0.5);
  color = mix(color, h1Color, lineH1 * 0.5);
  color = mix(color, h3Color, lineH3 * 0.5);
  color = mix(color, h5Color, lineH5 * 0.5);
  color = mix(color, h7Color, lineH7 * 0.5);
  color = mix(color, compColor, lineComposite);

  fragColor = vec4(color, 1.0);
}
