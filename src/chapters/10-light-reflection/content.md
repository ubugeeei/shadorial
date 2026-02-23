# Light & Reflection

Shapes become objects when light hits them. In this chapter, we implement the **Phong lighting model** -- the classic technique for simulating how light interacts with surfaces. Even in 2D fragment shaders, we can create convincing 3D-looking surfaces by computing lighting per pixel.

## The Phong Lighting Model

The Phong model breaks light interaction into three components:

1. **Ambient** -- constant base illumination (simulates indirect light)
2. **Diffuse** -- light scattered evenly from rough surfaces
3. **Specular** -- bright highlights from mirror-like reflection

The final color is the sum of all three:

```c
vec3 result = ambient + diffuse + specular;
```

## Vectors You Need

To compute lighting, you need four vectors at each point on the surface:

- **Normal** (`N`) -- perpendicular to the surface at the hit point
- **Light direction** (`L`) -- from the surface point toward the light
- **View direction** (`V`) -- from the surface point toward the camera
- **Reflection** (`R`) -- the light direction reflected around the normal

```c
vec3 N = normalize(hitPoint - sphereCenter); // surface normal
vec3 L = normalize(lightPos - hitPoint);      // toward light
vec3 V = normalize(cameraPos - hitPoint);     // toward camera
vec3 R = reflect(-L, N);                      // reflected light
```

## Ambient Light

Ambient light is the simplest component. It represents the minimum illumination that reaches every surface, regardless of orientation:

```c
float ambientStrength = 0.1;
vec3 ambient = ambientStrength * lightColor * materialColor;
```

Without ambient light, any surface facing away from the light would be completely black.

## Diffuse Lighting (Lambert)

Diffuse lighting follows **Lambert's cosine law**: the brightness of a surface is proportional to the cosine of the angle between the surface normal and the light direction.

```c
float diff = max(dot(N, L), 0.0);
vec3 diffuse = diff * lightColor * materialColor;
```

The `max(..., 0.0)` ensures we do not get negative light (surfaces facing away from the light stay dark, not negative).

## Specular Highlights

Specular highlights create the shiny bright spots you see on smooth surfaces. The brightness depends on how closely the view direction aligns with the reflected light direction:

```c
float spec = pow(max(dot(V, R), 0.0), shininess);
vec3 specular = specularStrength * spec * lightColor;
```

The `shininess` exponent controls how tight the highlight is:
- Low values (8-16): broad, matte highlight
- High values (64-256): tight, glossy highlight

Notice that specular does not multiply by `materialColor` -- highlights tend to be the color of the light source, not the material.

## The Fresnel Effect

The **Fresnel effect** describes how surfaces become more reflective at glancing angles. Look at a table from a steep angle and it appears matte; look at it from a shallow angle and it becomes mirror-like.

A simple approximation:

```c
float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
```

When the view direction is perpendicular to the normal (glancing angle), `dot(N, V)` is near zero, making the Fresnel term large.

## The Default Shader

The default code renders a 3D-looking sphere using ray-sphere intersection:

1. For each pixel, a ray is cast from the camera.
2. If the ray hits the sphere, we compute the intersection point and normal.
3. The Phong model (ambient + diffuse + specular + Fresnel) computes the final color.
4. The light orbits the sphere, showing how the highlights move across the surface.

This is a simplified form of **ray marching** -- a technique we will revisit in later chapters.

## Beyond Phong: Blinn-Phong

A common improvement is the **Blinn-Phong** model, which uses a **half vector** instead of the reflection vector:

```c
vec3 H = normalize(L + V);
float spec = pow(max(dot(N, H), 0.0), shininess);
```

Blinn-Phong is slightly more efficient and often looks more realistic, which is why it was the default in older OpenGL fixed-function pipelines.

## Exercises

1. **Change the material** -- Modify `materialColor` to different values and observe how diffuse lighting changes. Try a gold-like color: `vec3(1.0, 0.8, 0.3)`.

2. **Multiple lights** -- Add a second light source. Compute the Phong model for each light and sum the results. Use different colors for each light (e.g., warm and cool).

3. **Shininess slider** -- Use `u_mouse.x / u_resolution.x` to control the shininess exponent. Sweep from 2.0 (very matte) to 256.0 (mirror-like).

4. **Toon shading** -- Quantize the diffuse term into discrete steps: `diff = floor(diff * 4.0) / 4.0;` This creates a cel-shaded, cartoon look.

5. **Rim lighting** -- Add a rim light effect using the Fresnel term. Multiply by a bright color to create an edge glow, as if there is a light behind the object.

6. **Blinn-Phong** -- Replace the Phong specular calculation with Blinn-Phong using the half vector. Compare the two visually.

In the next chapter, we will explore animation techniques -- easing functions and time-based motion.
