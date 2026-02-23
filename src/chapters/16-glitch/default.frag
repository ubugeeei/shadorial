#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

float hash(float n) {
  return fract(sin(n) * 43758.5453);
}

float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // Time-based glitch trigger
  float glitchTime = floor(u_time * 6.0);
  float glitchIntensity = step(0.85, hash(glitchTime));

  // Block displacement
  float blockSize = 0.05 + hash(glitchTime + 1.0) * 0.1;
  float block = floor(uv.y / blockSize);
  float blockRand = hash2(vec2(block, glitchTime));
  float blockGlitch = step(0.7, blockRand) * glitchIntensity;
  vec2 glitchUV = uv;
  glitchUV.x += blockGlitch * (blockRand - 0.5) * 0.3;

  // Base pattern: colored bars
  vec3 baseColor = vec3(0.0);
  float stripe = sin(glitchUV.x * 30.0 + glitchUV.y * 10.0) * 0.5 + 0.5;
  baseColor = mix(vec3(0.1, 0.2, 0.4), vec3(0.4, 0.1, 0.3), stripe);
  baseColor += 0.15 * sin(vec3(1.0, 2.0, 3.0) * glitchUV.y * 6.28 + u_time);

  // RGB split
  float splitAmount = glitchIntensity * 0.025;
  vec2 uvR = glitchUV + vec2(splitAmount, 0.0);
  vec2 uvB = glitchUV - vec2(splitAmount, 0.0);

  float stripeR = sin(uvR.x * 30.0 + uvR.y * 10.0) * 0.5 + 0.5;
  float stripeB = sin(uvB.x * 30.0 + uvB.y * 10.0) * 0.5 + 0.5;

  vec3 colorR = mix(vec3(0.1, 0.2, 0.4), vec3(0.4, 0.1, 0.3), stripeR);
  colorR += 0.15 * sin(vec3(1.0, 2.0, 3.0) * uvR.y * 6.28 + u_time);

  vec3 colorB = mix(vec3(0.1, 0.2, 0.4), vec3(0.4, 0.1, 0.3), stripeB);
  colorB += 0.15 * sin(vec3(1.0, 2.0, 3.0) * uvB.y * 6.28 + u_time);

  vec3 color = vec3(colorR.r, baseColor.g, colorB.b);

  // Scanlines
  float scanline = sin(gl_FragCoord.y * 1.5) * 0.04;
  color -= scanline;

  // Random noise in glitch blocks
  float noiseVal = hash2(gl_FragCoord.xy + glitchTime) * glitchIntensity * 0.15;
  color += noiseVal;

  // Occasional full-line flash
  float lineFlash = step(0.97, hash(floor(uv.y * 100.0) + glitchTime)) * glitchIntensity;
  color = mix(color, vec3(1.0), lineFlash * 0.5);

  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
