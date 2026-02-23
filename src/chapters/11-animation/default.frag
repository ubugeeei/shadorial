#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

// Easing functions
float easeInQuad(float t) {
  return t * t;
}

float easeOutQuad(float t) {
  return t * (2.0 - t);
}

float easeInOutCubic(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

float easeOutElastic(float t) {
  if (t == 0.0 || t == 1.0) return t;
  return pow(2.0, -10.0 * t) * sin((t * 10.0 - 0.75) * (2.0 * 3.14159 / 3.0)) + 1.0;
}

float easeOutBounce(float t) {
  if (t < 1.0 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2.0 / 2.75) {
    t -= 1.5 / 2.75;
    return 7.5625 * t * t + 0.75;
  } else if (t < 2.5 / 2.75) {
    t -= 2.25 / 2.75;
    return 7.5625 * t * t + 0.9375;
  } else {
    t -= 2.625 / 2.75;
    return 7.5625 * t * t + 0.984375;
  }
}

// Draw a filled circle
float circle(vec2 uv, vec2 center, float radius) {
  float pixelSize = 1.5 / u_resolution.y;
  return 1.0 - smoothstep(radius - pixelSize, radius + pixelSize, length(uv - center));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;

  // Looping time (each cycle is 3 seconds)
  float period = 3.0;
  float t = mod(u_time, period) / period; // 0..1 repeating

  // Ball radius
  float r = 0.03;

  // Horizontal lanes
  float laneSpacing = 0.12;
  float startX = -0.4;
  float endX = 0.4;

  // --- Lane 1: Linear (no easing) ---
  float y1 = 0.24;
  float x1 = mix(startX, endX, t);
  vec3 c1 = vec3(0.9, 0.3, 0.3);

  // --- Lane 2: Ease In Quad ---
  float y2 = 0.12;
  float x2 = mix(startX, endX, easeInQuad(t));
  vec3 c2 = vec3(0.9, 0.6, 0.2);

  // --- Lane 3: Ease Out Quad ---
  float y3 = 0.0;
  float x3 = mix(startX, endX, easeOutQuad(t));
  vec3 c3 = vec3(0.9, 0.9, 0.2);

  // --- Lane 4: Ease In-Out Cubic ---
  float y4 = -0.12;
  float x4 = mix(startX, endX, easeInOutCubic(t));
  vec3 c4 = vec3(0.3, 0.8, 0.4);

  // --- Lane 5: Elastic ---
  float y5 = -0.24;
  float x5 = mix(startX, endX, easeOutElastic(t));
  vec3 c5 = vec3(0.3, 0.6, 0.9);

  // --- Lane 6: Bounce ---
  float y6 = -0.36;
  float x6 = mix(startX, endX, easeOutBounce(t));
  vec3 c6 = vec3(0.7, 0.3, 0.9);

  // Background
  vec3 color = vec3(0.06);

  // Draw lane separator lines
  for (float i = -0.5; i <= 0.5; i += laneSpacing) {
    float line = 1.0 - smoothstep(0.0, 0.002, abs(uv.y - i + 0.06));
    color += vec3(0.08) * line;
  }

  // Draw labels (lane track backgrounds)
  float trackWidth = 0.005;

  // Draw each ball
  color = mix(color, c1, circle(uv, vec2(x1, y1), r));
  color = mix(color, c2, circle(uv, vec2(x2, y2), r));
  color = mix(color, c3, circle(uv, vec2(x3, y3), r));
  color = mix(color, c4, circle(uv, vec2(x4, y4), r));
  color = mix(color, c5, circle(uv, vec2(x5, y5), r));
  color = mix(color, c6, circle(uv, vec2(x6, y6), r));

  // Draw track lines (paths the balls follow)
  float trackLine1 = 1.0 - smoothstep(0.0, 0.002, abs(uv.y - y1));
  float trackLine2 = 1.0 - smoothstep(0.0, 0.002, abs(uv.y - y2));
  float trackLine3 = 1.0 - smoothstep(0.0, 0.002, abs(uv.y - y3));
  float trackLine4 = 1.0 - smoothstep(0.0, 0.002, abs(uv.y - y4));
  float trackLine5 = 1.0 - smoothstep(0.0, 0.002, abs(uv.y - y5));
  float trackLine6 = 1.0 - smoothstep(0.0, 0.002, abs(uv.y - y6));

  // Dim track lines behind the balls
  vec3 trackColor = vec3(0.15);
  color = mix(color, trackColor, trackLine1 * 0.3);
  color = mix(color, trackColor, trackLine2 * 0.3);
  color = mix(color, trackColor, trackLine3 * 0.3);
  color = mix(color, trackColor, trackLine4 * 0.3);
  color = mix(color, trackColor, trackLine5 * 0.3);
  color = mix(color, trackColor, trackLine6 * 0.3);

  // Re-draw balls on top of tracks
  color = mix(color, c1, circle(uv, vec2(x1, y1), r));
  color = mix(color, c2, circle(uv, vec2(x2, y2), r));
  color = mix(color, c3, circle(uv, vec2(x3, y3), r));
  color = mix(color, c4, circle(uv, vec2(x4, y4), r));
  color = mix(color, c5, circle(uv, vec2(x5, y5), r));
  color = mix(color, c6, circle(uv, vec2(x6, y6), r));

  fragColor = vec4(color, 1.0);
}
