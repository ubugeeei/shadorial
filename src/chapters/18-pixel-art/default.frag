#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float bayer4x4(vec2 p) {
  vec2 c = mod(p, 4.0);
  int x = int(c.x);
  int y = int(c.y);
  int idx = x + y * 4;
  // 4x4 Bayer matrix values /16
  float m[16] = float[16](
    0.0, 8.0, 2.0, 10.0,
    12.0, 4.0, 14.0, 6.0,
    3.0, 11.0, 1.0, 9.0,
    15.0, 7.0, 13.0, 5.0
  );
  return m[idx] / 16.0 - 0.5;
}

void main() {
  float pixelSize = 80.0;
  vec2 pixUV = floor(gl_FragCoord.xy / (u_resolution.y / pixelSize));
  vec2 uv = pixUV / pixelSize;

  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;

  float t = u_time * 0.5;

  // Sky gradient
  vec3 skyTop = vec3(0.1, 0.05, 0.2);
  vec3 skyBot = vec3(0.6, 0.3, 0.1);
  vec3 color = mix(skyBot, skyTop, uv.y);

  // Sun
  vec2 sunPos = vec2(aspect * 0.5, 0.35);
  float sunDist = length(uv - sunPos);
  vec3 sunColor = vec3(1.0, 0.7, 0.2);
  float sun = smoothstep(0.12, 0.1, sunDist);
  color = mix(color, sunColor, sun);

  // Sun glow
  float glow = 0.05 / (sunDist + 0.05);
  color += sunColor * glow * 0.15;

  // Scrolling hills (3 layers)
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float speed = 0.02 + fi * 0.01;
    float freq = 3.0 + fi * 2.0;
    float height = 0.15 + fi * 0.08;
    float hillX = uv.x + t * speed;
    float hill = height + sin(hillX * freq) * 0.06
                 + sin(hillX * freq * 2.3 + 1.0) * 0.03;
    float darkness = 0.15 - fi * 0.04;
    vec3 hillColor = vec3(darkness, darkness + 0.05, darkness);
    if (uv.y < hill) {
      color = hillColor;
    }
  }

  // Stars (only in upper sky)
  if (uv.y > 0.5) {
    float starField = hash(floor(pixUV));
    float twinkle = sin(u_time * 3.0 + starField * 100.0) * 0.5 + 0.5;
    if (starField > 0.98) {
      color += vec3(0.8, 0.8, 1.0) * twinkle;
    }
  }

  // Color quantization with dithering
  float levels = 5.0;
  float dither = bayer4x4(gl_FragCoord.xy / (u_resolution.y / pixelSize)) / levels;
  color = floor((color + dither) * levels) / levels;

  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
