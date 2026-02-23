#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

// Circle SDF: returns the signed distance from point p to a circle at origin with radius r
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

// Rounded rectangle SDF: b is half-size, r is corner radius
float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// Equilateral triangle SDF
float sdTriangle(vec2 p, float r) {
  const float k = sqrt(3.0);
  p.x = abs(p.x) - r;
  p.y = p.y + r / k;
  if (p.x + k * p.y > 0.0) {
    p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
  }
  p.x -= clamp(p.x, -2.0 * r, 0.0);
  return -length(p) * sign(p.y);
}

void main() {
  // Normalized coordinates centered at origin, aspect-corrected
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;

  // Animate positions slightly
  float t = u_time * 0.8;
  vec2 circlePos = vec2(-0.35, 0.0) + 0.03 * vec2(sin(t), cos(t * 1.3));
  vec2 rectPos = vec2(0.0, 0.0) + 0.03 * vec2(cos(t * 0.9), sin(t * 1.1));
  vec2 triPos = vec2(0.35, 0.0) + 0.03 * vec2(sin(t * 1.2), cos(t * 0.7));

  // Compute signed distances
  float dCircle = sdCircle(uv - circlePos, 0.15);
  float dRect = sdRoundedRect(uv - rectPos, vec2(0.12, 0.10), 0.03);
  float dTri = sdTriangle(uv - triPos, 0.15);

  // Combine shapes using union (minimum distance)
  float dUnion = min(dCircle, min(dRect, dTri));

  // Background color based on distance field (visualize the SDF)
  vec3 bgColor = vec3(0.95) - vec3(0.1) * sign(dUnion);

  // Distance band coloring (concentric rings showing the distance field)
  float bands = 0.5 + 0.5 * cos(dUnion * 80.0);
  bgColor *= 0.8 + 0.2 * bands;

  // Shape colors
  vec3 circleColor = vec3(0.2, 0.6, 0.9);
  vec3 rectColor = vec3(0.9, 0.4, 0.3);
  vec3 triColor = vec3(0.3, 0.8, 0.4);

  // Smooth fill using smoothstep for anti-aliasing
  float pixelSize = 1.5 / u_resolution.y;

  float fillCircle = 1.0 - smoothstep(0.0, pixelSize, dCircle);
  float fillRect = 1.0 - smoothstep(0.0, pixelSize, dRect);
  float fillTri = 1.0 - smoothstep(0.0, pixelSize, dTri);

  // Compose final color
  vec3 color = bgColor;
  color = mix(color, circleColor, fillCircle);
  color = mix(color, rectColor, fillRect);
  color = mix(color, triColor, fillTri);

  // Add a soft outline (border) around each shape
  float outlineCircle = smoothstep(pixelSize, pixelSize * 2.0, abs(dCircle) - 0.005);
  float outlineRect = smoothstep(pixelSize, pixelSize * 2.0, abs(dRect) - 0.005);
  float outlineTri = smoothstep(pixelSize, pixelSize * 2.0, abs(dTri) - 0.005);

  float outline = min(outlineCircle, min(outlineRect, outlineTri));
  color *= 0.3 + 0.7 * outline;

  fragColor = vec4(color, 1.0);
}
