# Three.js Interactive

In this final chapter, we bring shaders into 3D with Three.js via TresJS. Instead of a flat fullscreen quad, you'll apply custom `ShaderMaterial` to 3D meshes, animate them in a scene, and interact with them using mouse and camera controls.

## From 2D to 3D Shaders

In previous chapters, shaders ran on a fullscreen rectangle. In Three.js, shaders run on mesh surfaces. The key differences:

- **Vertex shader** receives model geometry (positions, normals, UVs) and transforms them
- **Fragment shader** receives interpolated varyings from the vertex shader
- **Uniforms** include model/view/projection matrices from Three.js

## ShaderMaterial

Three.js provides `ShaderMaterial` for custom shaders:

```javascript
const material = new THREE.ShaderMaterial({
  vertexShader: `...`,
  fragmentShader: `...`,
  uniforms: {
    u_time: { value: 0.0 },
    u_color: { value: new THREE.Color(0.2, 0.5, 1.0) },
  },
});
```

## TresJS Integration

TresJS lets us use Three.js declaratively in Vue:

```vue
<TresCanvas>
  <TresMesh>
    <TresSphereGeometry :args="[1, 64, 64]" />
    <TresShaderMaterial :vertex-shader="vert" :fragment-shader="frag" :uniforms="uniforms" />
  </TresMesh>
</TresCanvas>
```

## Varyings

Varyings pass data from vertex to fragment shader. For example, passing the normal:

```c
// Vertex shader
varying vec3 vNormal;
void main() {
  vNormal = normalMatrix * normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

## The Default Shader

The default code applies a custom shader to a rotating sphere. The vertex shader deforms the surface using noise, and the fragment shader colors it based on the surface normal and a time-based animation.

## Exercises

1. **Different geometry** -- Apply the shader to a torus, cube, or custom geometry.
2. **Mouse interaction** -- Pass the mouse position as a uniform and use it to deform the mesh.
3. **Post-processing** -- Add a post-processing pass with a fullscreen shader effect.
4. **Multiple objects** -- Create a scene with multiple objects, each with a different shader.
5. **Environment** -- Add environment mapping by sampling a cubemap in the fragment shader.
