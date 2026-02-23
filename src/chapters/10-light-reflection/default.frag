#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
  // Centered UV coordinates, aspect-corrected
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;

  // Sphere parameters
  vec3 sphereCenter = vec3(0.0, 0.0, 0.0);
  float sphereRadius = 0.35;

  // Animated light position (orbits around the sphere)
  float lt = u_time * 0.7;
  vec3 lightPos = vec3(0.8 * cos(lt), 0.5 * sin(lt * 0.8), 1.0);

  // Camera setup (simple orthographic-like projection)
  vec3 rayOrigin = vec3(uv, 2.0);
  vec3 rayDir = vec3(0.0, 0.0, -1.0);

  // Ray-sphere intersection
  vec3 oc = rayOrigin - sphereCenter;
  float b = dot(oc, rayDir);
  float c = dot(oc, oc) - sphereRadius * sphereRadius;
  float discriminant = b * b - c;

  // Background gradient
  vec3 bgColor = mix(vec3(0.08, 0.08, 0.15), vec3(0.15, 0.1, 0.2), uv.y + 0.5);

  if (discriminant < 0.0) {
    fragColor = vec4(bgColor, 1.0);
    return;
  }

  // Intersection point and normal
  float t = -b - sqrt(discriminant);
  vec3 hitPoint = rayOrigin + t * rayDir;
  vec3 normal = normalize(hitPoint - sphereCenter);

  // Vectors for Phong model
  vec3 lightDir = normalize(lightPos - hitPoint);
  vec3 viewDir = normalize(rayOrigin - hitPoint);
  vec3 reflectDir = reflect(-lightDir, normal);

  // Material properties
  vec3 materialColor = vec3(0.3, 0.5, 0.8);
  vec3 lightColor = vec3(1.0, 0.95, 0.85);

  // --- Phong lighting model ---

  // Ambient component: constant base illumination
  float ambientStrength = 0.1;
  vec3 ambient = ambientStrength * lightColor * materialColor;

  // Diffuse component: Lambert's cosine law
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = diff * lightColor * materialColor;

  // Specular component: mirror-like highlight
  float specularStrength = 0.8;
  float shininess = 64.0;
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
  vec3 specular = specularStrength * spec * lightColor;

  // Simple Fresnel approximation (brighter at glancing angles)
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
  vec3 fresnelColor = fresnel * vec3(0.4, 0.5, 0.7) * 0.5;

  // Combine all lighting components
  vec3 color = ambient + diffuse + specular + fresnelColor;

  // Add a subtle ground shadow
  float shadow = smoothstep(-0.4, -0.3, uv.y);
  bgColor *= shadow;

  // Final composite
  float sphereMask = step(0.0, discriminant);
  vec3 finalColor = mix(bgColor, color, sphereMask);

  fragColor = vec4(finalColor, 1.0);
}
