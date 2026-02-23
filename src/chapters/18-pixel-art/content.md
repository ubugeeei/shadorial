# Pixel Art

Pixel art shaders recreate the charm of low-resolution retro graphics. By quantizing coordinates and colors, we can turn any pattern into a pixelated masterpiece. Combined with dithering and limited palettes, we get authentic 8-bit and 16-bit aesthetics.

## Pixelation

The core technique is quantizing UV coordinates to a grid:

```c
float pixels = 64.0;
vec2 pixelUV = floor(uv * pixels) / pixels;
```

This snaps every pixel to the nearest grid cell, creating blocky low-res output.

## Color Quantization

Retro systems had limited color palettes. Quantize each channel:

```c
float levels = 4.0; // 4 levels per channel = 64 total colors
color = floor(color * levels) / levels;
```

## Ordered Dithering

Dithering simulates more colors using patterns. Bayer matrix dithering:

```c
float bayer2x2(vec2 p) {
  float m = mod(p.x + p.y * 2.0, 4.0);
  return m / 4.0 - 0.375;
}
color += bayer2x2(gl_FragCoord.xy) / levels;
color = floor(color * levels) / levels;
```

## The Default Shader

The default code creates an animated pixel-art landscape with a setting sun, scrolling hills, and stars, all rendered at a low virtual resolution with color quantization and dithering.

## Exercises

1. **Resolution control** -- Change the pixel grid size to see the effect of different resolutions.
2. **Custom palette** -- Create a specific 16-color palette and snap colors to the nearest match.
3. **CRT curvature** -- Add barrel distortion to simulate a curved CRT screen.
4. **Sprite animation** -- Create a simple animated character using if-statements and pixel coordinates.
5. **Scanline overlay** -- Add alternating bright/dark horizontal lines for a CRT effect.
