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

  // Animated duty cycle: oscillates between 0.2 and 0.8
  float duty = 0.5 + 0.3 * sin(u_time * 0.8);

  // Pulse wave using step()
  // Compare fractional part against the duty cycle threshold
  float pulse = step(fract(x), duty) * 2.0 - 1.0;  // map to [-1, 1]

  // Draw the pulse wave as a line
  // For a pulse wave, we need both horizontal and vertical segments
  float lineWidth = 0.025;

  // Horizontal segments (top and bottom of the pulse)
  float distH = abs(y - pulse * 0.4);
  float lineH = 1.0 - smoothstep(0.0, lineWidth, distH);

  // Vertical transitions (rising and falling edges)
  float fractX = fract(x);
  float edgeRise = abs(fractX) < 0.02 ? 1.0 : 0.0;
  float edgeFall = abs(fractX - duty) < 0.02 ? 1.0 : 0.0;
  float vertLine = (edgeRise + edgeFall) * step(abs(y), 0.4);

  // Axis line
  float axis = 1.0 - smoothstep(0.0, 0.005, abs(y));

  // Background pattern: subtle grid
  float gridX = 1.0 - smoothstep(0.0, 0.008, abs(fract(x) - 0.5));
  float gridY = 1.0 - smoothstep(0.0, 0.008, abs(fract(uv.y * 4.0) - 0.5));

  // Colors
  vec3 bgColor = vec3(0.05);
  vec3 gridColor = vec3(0.1);
  vec3 axisColor = vec3(0.3);
  vec3 pulseColor = vec3(0.9, 0.3, 0.6);  // pink for pulse wave

  // Compose
  vec3 color = bgColor;
  color = mix(color, gridColor, (gridX + gridY) * 0.3);
  color = mix(color, axisColor, axis * 0.5);
  color = mix(color, pulseColor, lineH);
  color = mix(color, pulseColor, vertLine * 0.9);

  // Show the duty cycle value as a colored region at the bottom
  float dutyBar = step(uv.y, 0.05) * step(uv.x, duty);
  color = mix(color, vec3(0.9, 0.3, 0.6) * 0.5, dutyBar);

  fragColor = vec4(color, 1.0);
}
