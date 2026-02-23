export interface ChapterMeta {
  number: number;
  slug: string;
  dir: string;
  title: string;
  description: string;
}

export const chapters: ChapterMeta[] = [
  {
    number: 1,
    slug: "hello-shader",
    dir: "01-hello-shader",
    title: "Hello Shader",
    description: "Fragment shader basics, gl_FragColor, UV coordinates",
  },
  {
    number: 2,
    slug: "uniforms",
    dir: "02-uniforms",
    title: "Uniforms",
    description: "u_time, u_resolution, u_mouse",
  },
  {
    number: 3,
    slug: "colors-gradients",
    dir: "03-colors-gradients",
    title: "Colors & Gradients",
    description: "Color spaces, gradient techniques, mix/smoothstep",
  },
  {
    number: 4,
    slug: "sin-wave",
    dir: "04-sin-wave",
    title: "Sin Wave",
    description: "Sine wave basics, amplitude, frequency, phase",
  },
  {
    number: 5,
    slug: "saw-triangle-wave",
    dir: "05-saw-triangle-wave",
    title: "Saw & Triangle Wave",
    description: "Sawtooth wave, triangle wave generation",
  },
  {
    number: 6,
    slug: "pulse-wave",
    dir: "06-pulse-wave",
    title: "Pulse Wave",
    description: "Square/pulse waves, duty cycle",
  },
  {
    number: 7,
    slug: "noise-wave",
    dir: "07-noise-wave",
    title: "Noise Wave",
    description: "Random & noise-based wave patterns",
  },
  {
    number: 8,
    slug: "wave-composition",
    dir: "08-wave-composition",
    title: "Wave Composition",
    description: "Combining waves, additive synthesis, harmonic series",
  },
  {
    number: 9,
    slug: "shapes-sdf",
    dir: "09-shapes-sdf",
    title: "Shapes & SDF",
    description: "Distance functions, circle/rect/polygon rendering",
  },
  {
    number: 10,
    slug: "light-reflection",
    dir: "10-light-reflection",
    title: "Light & Reflection",
    description: "Phong model, specular/diffuse, Fresnel effect",
  },
  {
    number: 11,
    slug: "animation",
    dir: "11-animation",
    title: "Animation",
    description: "Time-based animation, easing functions",
  },
  {
    number: 12,
    slug: "noise",
    dir: "12-noise",
    title: "Noise",
    description: "Perlin/Simplex noise, FBM, domain warping",
  },
  {
    number: 13,
    slug: "particles",
    dir: "13-particles",
    title: "Particles",
    description: "Particle systems, GPU particles",
  },
  {
    number: 14,
    slug: "fluid-water",
    dir: "14-fluid-water",
    title: "Fluid (Water)",
    description: "Water surface simulation, reflection & refraction",
  },
  {
    number: 15,
    slug: "fluid-smoke",
    dir: "15-fluid-smoke",
    title: "Fluid (Smoke)",
    description: "Smoke & fluid simulation",
  },
  {
    number: 16,
    slug: "glitch",
    dir: "16-glitch",
    title: "Glitch",
    description: "Glitch effects, RGB shift, distortion",
  },
  {
    number: 17,
    slug: "geometric",
    dir: "17-geometric",
    title: "Geometric",
    description: "Geometric patterns, tiling, kaleidoscope",
  },
  {
    number: 18,
    slug: "pixel-art",
    dir: "18-pixel-art",
    title: "Pixel Art",
    description: "Pixelation, dithering, retro effects",
  },
  {
    number: 19,
    slug: "three-interactive",
    dir: "19-three-interactive",
    title: "Three.js Interactive",
    description: "Custom ShaderMaterial with TresJS, interactive 3D",
  },
];
