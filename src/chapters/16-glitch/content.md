# Glitch

Glitch effects simulate digital artifacts, corrupted signals, and analog distortions. They create a striking, edgy aesthetic popular in music videos, cyberpunk art, and creative coding. In this chapter we combine RGB channel splitting, scanlines, block displacement, and noise-driven distortion.

## RGB Channel Shift

The simplest glitch is shifting each color channel by a different offset:

```c
float shift = 0.02 * sin(u_time * 10.0);
float r = texture(image, uv + vec2(shift, 0.0)).r;
float g = texture(image, uv).g;
float b = texture(image, uv - vec2(shift, 0.0)).b;
```

Without a texture, we apply the shift to procedural patterns by sampling color at shifted UVs.

## Block Displacement

Digital glitches often appear as rectangular blocks that jump to wrong positions:

```c
float block = floor(uv.y * 20.0);
float glitchAmount = step(0.95, hash(vec2(block, floor(u_time * 4.0))));
uv.x += glitchAmount * 0.2;
```

## Scanlines

CRT-style horizontal scanlines add an analog feel:

```c
float scanline = sin(uv.y * 800.0) * 0.04;
color -= scanline;
```

## The Default Shader

The default code renders a procedural pattern with periodic glitch bursts that include RGB splitting, horizontal block displacement, scanlines, and random color noise.

## Exercises

1. **Glitch intensity** -- Make the glitch effect respond to `u_mouse.x` position.
2. **Vertical glitch** -- Add vertical block displacement in addition to horizontal.
3. **Color inversion** -- Randomly invert colors in glitched blocks.
4. **VHS effect** -- Add subtle horizontal wobble and color bleeding for a VHS look.
5. **Timed bursts** -- Make glitches appear in short intense bursts with calm periods between.
