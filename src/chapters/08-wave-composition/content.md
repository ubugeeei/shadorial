# Wave Composition

In the previous chapters, we studied individual wave types: sine, sawtooth, triangle, pulse, and noise. Each one is a useful building block on its own, but the real power emerges when you **combine** them. Wave composition -- adding multiple waves together -- is the foundation of additive synthesis and the key to creating rich, complex patterns from simple ingredients.

## The Principle of Superposition

When two waves occupy the same space, their values simply **add together**. This is the principle of superposition:

```c
float combined = waveA + waveB;
```

If wave A has a value of 0.3 at some point, and wave B has a value of -0.1 at the same point, the combined value is 0.2. The waves do not interfere with each other in any complex way -- they just sum.

This simple principle produces surprisingly complex results when the waves have different frequencies, amplitudes, and phases.

## Additive Synthesis

**Additive synthesis** is the technique of building complex waveforms by summing many simple sine waves. It is based on a profound mathematical fact: any periodic waveform can be decomposed into a sum of sine waves.

### Building a Square Wave

A perfect square wave can be approximated by summing odd harmonics:

```c
float square = sin(x);                     // 1st harmonic (fundamental)
square += sin(3.0 * x) / 3.0;             // 3rd harmonic
square += sin(5.0 * x) / 5.0;             // 5th harmonic
square += sin(7.0 * x) / 7.0;             // 7th harmonic
square += sin(9.0 * x) / 9.0;             // 9th harmonic
square *= 4.0 / 3.14159;                  // scale factor (4/PI)
```

With just the first harmonic, you get a plain sine wave. Adding the 3rd harmonic starts to flatten the top. Each additional harmonic makes the waveform closer to a perfect square wave. The pattern is: only odd-numbered harmonics, each with amplitude 1/n.

### Building a Sawtooth Wave

A sawtooth wave uses **all** harmonics (both odd and even):

```c
float saw = sin(x);                        // 1st harmonic
saw -= sin(2.0 * x) / 2.0;                // 2nd harmonic
saw += sin(3.0 * x) / 3.0;                // 3rd harmonic
saw -= sin(4.0 * x) / 4.0;                // 4th harmonic
saw *= 2.0 / 3.14159;                     // scale factor (2/PI)
```

Notice the alternating signs (+ - + -). More harmonics produce a closer approximation.

### Building a Triangle Wave

A triangle wave, like a square wave, uses only odd harmonics, but the amplitudes decrease as 1/n-squared:

```c
float tri = sin(x);                        // 1st harmonic
tri -= sin(3.0 * x) / 9.0;                // 3rd harmonic (1/3^2)
tri += sin(5.0 * x) / 25.0;               // 5th harmonic (1/5^2)
tri -= sin(7.0 * x) / 49.0;               // 7th harmonic (1/7^2)
tri *= 8.0 / (3.14159 * 3.14159);         // scale factor (8/PI^2)
```

## The Fourier Series

The mathematical framework behind all of this is the **Fourier series**, named after Joseph Fourier. The core idea is:

> Any periodic function can be represented as a sum of sine and cosine waves of different frequencies.

In shader programming, you do not need to understand the full mathematics. The practical takeaway is:

- **Simple waves** are building blocks.
- **Complex patterns** are sums of simple waves.
- **Adding more harmonics** adds more detail.
- **Higher harmonics** contribute finer features.

## The Harmonic Series

When the frequencies of your component waves are integer multiples of a base frequency, they form a **harmonic series**:

| Harmonic | Frequency | Musical Interval |
|---|---|---|
| 1st (fundamental) | f | Root |
| 2nd | 2f | Octave |
| 3rd | 3f | Perfect fifth + octave |
| 4th | 4f | Two octaves |
| 5th | 5f | Major third + two octaves |

In the default shader, harmonics 1, 3, 5, and 7 are shown. Each harmonic is drawn as a dim colored line, and the **composite** (their sum) is drawn as a bright gold line. You can visually see how the individual harmonics combine to form the composite shape.

## The Default Shader

The default code demonstrates additive synthesis with four harmonics:

- **Dim blue**: 1st harmonic (fundamental) -- `sin(x)`
- **Dim green**: 3rd harmonic -- `sin(3x) / 3`
- **Dim red**: 5th harmonic -- `sin(5x) / 5`
- **Dim yellow**: 7th harmonic -- `sin(7x) / 7`
- **Bright gold**: The sum of all four

Each harmonic is animated at a slightly different speed to show how the composite shape evolves when harmonics drift in and out of phase.

## Beyond Regular Harmonics

You are not limited to integer frequency ratios. Using non-integer ratios produces **inharmonic** tones -- patterns that do not repeat perfectly:

```c
float complex = sin(x);
complex += 0.5 * sin(2.7 * x);   // not a harmonic
complex += 0.3 * sin(4.1 * x);   // not a harmonic
```

Inharmonic combinations produce evolving, non-repeating patterns that are useful for organic effects.

### Mixing Wave Types

You can also combine different wave types:

```c
float mixed = sin(x) * 0.5;                           // sine base
mixed += (fract(x * 2.0 / 6.2832) * 2.0 - 1.0) * 0.2; // sawtooth detail
mixed += (step(0.5, fract(x * 3.0 / 6.2832))) * 0.1;   // pulse accent
```

Each wave type contributes its characteristic shape to the composite.

## Practical Applications

### Ocean Waves

Real ocean surfaces are the sum of many waves at different scales:

```c
float ocean = 0.0;
ocean += sin(x * 1.0 + u_time * 0.5) * 0.4;
ocean += sin(x * 2.3 + u_time * 0.8) * 0.2;
ocean += sin(x * 5.7 + u_time * 1.2) * 0.1;
ocean += sin(x * 11.0 + u_time * 1.7) * 0.05;
```

### Audio Visualization

Additive synthesis is how synthesizers create complex tones. The same principle visualized in a shader shows how timbre (tonal quality) comes from harmonic content.

### Terrain Generation

Height maps for terrain are built by summing noise or sine waves at multiple frequencies -- the same concept, applied in 2D.

## Exercises

1. **Add more harmonics** -- Add 9th and 11th harmonics to the default shader. Observe how the composite wave becomes closer to a square wave shape.

2. **Sawtooth from sines** -- Replace the odd harmonics with the sawtooth series (all harmonics with alternating signs). Compare the result with the `fract()`-based sawtooth from Chapter 5.

3. **Frequency drift** -- Make the harmonics slowly detune: `sin((3.0 + 0.1 * sin(u_time * 0.3)) * x)`. This creates a "chorus" effect where the wave shape evolves over time.

4. **Interactive harmonics** -- Use `u_mouse.x / u_resolution.x` to control how many harmonics are included. When the mouse is on the left, show only the fundamental; on the right, include all harmonics.

5. **Ocean surface** -- Build an ocean wave by summing 5+ sine waves with non-integer frequency ratios and different speeds. Color the area below the wave blue and above it white.

6. **Amplitude modulation** -- Multiply two waves together instead of adding them: `sin(x) * sin(x * 0.1 + u_time)`. This produces amplitude modulation, creating a "beating" effect.

In the next chapter, we will leave the world of one-dimensional waves and enter 2D space with shapes and signed distance functions.
