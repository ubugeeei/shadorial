// Note: This fragment shader is designed for Three.js ShaderMaterial
// It uses Three.js built-in uniforms and varyings

precision highp float;

varying vec3 vNormal;
varying vec2 vUv;
varying float vDisplacement;

uniform float u_time;

void main() {
  // Color based on normal direction
  vec3 normal = normalize(vNormal);
  vec3 baseColor = normal * 0.5 + 0.5;

  // Animate color
  float pulse = sin(u_time * 2.0) * 0.5 + 0.5;
  vec3 color1 = vec3(0.2, 0.5, 1.0);
  vec3 color2 = vec3(1.0, 0.3, 0.5);

  vec3 dynamicColor = mix(color1, color2, pulse);
  vec3 color = mix(baseColor, dynamicColor, 0.5);

  // Add displacement-based highlight
  float highlight = smoothstep(0.0, 0.3, vDisplacement);
  color += vec3(0.3, 0.4, 0.5) * highlight;

  // Fresnel-like rim lighting
  float rim = 1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0);
  rim = pow(rim, 3.0);
  color += vec3(0.4, 0.6, 1.0) * rim * 0.6;

  gl_FragColor = vec4(color, 1.0);
}
