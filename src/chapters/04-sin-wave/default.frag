#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // Map UV to a coordinate system centered vertically
  float x = uv.x * 10.0;           // scale x for multiple wave cycles
  float y = uv.y * 2.0 - 1.0;      // map y to [-1, 1]

  // Sine wave parameters
  float amplitude = 0.5;
  float frequency = 1.0;
  float phase = u_time * 2.0;

  // Compute the sine wave value at this x position
  float wave = amplitude * sin(frequency * x + phase);

  // Distance from the current pixel to the wave curve
  float dist = abs(y - wave);

  // Draw the wave as an anti-aliased line using smoothstep
  float lineWidth = 0.03;
  float line = 1.0 - smoothstep(0.0, lineWidth, dist);

  // Draw a faint horizontal axis line at y = 0
  float axis = 1.0 - smoothstep(0.0, 0.005, abs(y));

  // Color the wave line with a gradient based on position
  vec3 waveColor = vec3(0.2, 0.6, 1.0);
  vec3 axisColor = vec3(0.3);
  vec3 bgColor = vec3(0.05);

  // Add a secondary wave with different frequency for visual richness
  float wave2 = 0.3 * sin(2.0 * x + phase * 0.7);
  float dist2 = abs(y - wave2);
  float line2 = 1.0 - smoothstep(0.0, lineWidth, dist2);
  vec3 waveColor2 = vec3(1.0, 0.4, 0.3);

  vec3 color = bgColor;
  color = mix(color, axisColor, axis * 0.5);
  color = mix(color, waveColor2, line2 * 0.8);
  color = mix(color, waveColor, line);

  fragColor = vec4(color, 1.0);
}
