// ---- Interfaces ----

export interface GlslFunctionSignature {
  label: string;
  parameters: { label: string; documentation?: string }[];
}

export interface GlslFunction {
  name: string;
  signatures: GlslFunctionSignature[];
  description: string;
  category: string;
}

export interface GlslType {
  name: string;
  description: string;
}

export interface GlslBuiltinVariable {
  name: string;
  type: string;
  description: string;
}

export interface GlslUniform {
  name: string;
  type: string;
  description: string;
}

export interface GlslKeyword {
  name: string;
  description: string;
}

export interface GlslSnippet {
  label: string;
  insertText: string;
  description: string;
}

// ---- Helpers ----

function genTypeSigs(
  name: string,
  extraParams?: string,
): GlslFunctionSignature[] {
  const types = ["float", "vec2", "vec3", "vec4"];
  const suffix = extraParams ? ", " + extraParams : "";
  return types.map((t) => ({
    label: `${t} ${name}(${t} x${suffix})`,
    parameters: [
      { label: `${t} x` },
      ...(extraParams
        ? extraParams.split(", ").map((p) => ({ label: p }))
        : []),
    ],
  }));
}

function genType2Sigs(name: string): GlslFunctionSignature[] {
  const types = ["float", "vec2", "vec3", "vec4"];
  return types.map((t) => ({
    label: `${t} ${name}(${t} x, ${t} y)`,
    parameters: [{ label: `${t} x` }, { label: `${t} y` }],
  }));
}

function genType3Sigs(name: string): GlslFunctionSignature[] {
  const types = ["float", "vec2", "vec3", "vec4"];
  return types.map((t) => ({
    label: `${t} ${name}(${t} x, ${t} y, ${t} z)`,
    parameters: [{ label: `${t} x` }, { label: `${t} y` }, { label: `${t} z` }],
  }));
}

// ---- Functions ----

export const GLSL_FUNCTIONS: GlslFunction[] = [
  // Trigonometric
  {
    name: "radians",
    signatures: genTypeSigs("radians"),
    description: "Converts degrees to radians.",
    category: "Trigonometric",
  },
  {
    name: "degrees",
    signatures: genTypeSigs("degrees"),
    description: "Converts radians to degrees.",
    category: "Trigonometric",
  },
  {
    name: "sin",
    signatures: genTypeSigs("sin"),
    description: "Returns the sine of the parameter.",
    category: "Trigonometric",
  },
  {
    name: "cos",
    signatures: genTypeSigs("cos"),
    description: "Returns the cosine of the parameter.",
    category: "Trigonometric",
  },
  {
    name: "tan",
    signatures: genTypeSigs("tan"),
    description: "Returns the tangent of the parameter.",
    category: "Trigonometric",
  },
  {
    name: "asin",
    signatures: genTypeSigs("asin"),
    description: "Returns the arcsine of the parameter.",
    category: "Trigonometric",
  },
  {
    name: "acos",
    signatures: genTypeSigs("acos"),
    description: "Returns the arccosine of the parameter.",
    category: "Trigonometric",
  },
  {
    name: "atan",
    signatures: [...genTypeSigs("atan"), ...genType2Sigs("atan")],
    description:
      "Returns the arctangent. The two-argument form computes atan(y/x).",
    category: "Trigonometric",
  },

  // Hyperbolic
  {
    name: "sinh",
    signatures: genTypeSigs("sinh"),
    description: "Returns the hyperbolic sine.",
    category: "Hyperbolic",
  },
  {
    name: "cosh",
    signatures: genTypeSigs("cosh"),
    description: "Returns the hyperbolic cosine.",
    category: "Hyperbolic",
  },
  {
    name: "tanh",
    signatures: genTypeSigs("tanh"),
    description: "Returns the hyperbolic tangent.",
    category: "Hyperbolic",
  },
  {
    name: "asinh",
    signatures: genTypeSigs("asinh"),
    description: "Returns the inverse hyperbolic sine.",
    category: "Hyperbolic",
  },
  {
    name: "acosh",
    signatures: genTypeSigs("acosh"),
    description: "Returns the inverse hyperbolic cosine.",
    category: "Hyperbolic",
  },
  {
    name: "atanh",
    signatures: genTypeSigs("atanh"),
    description: "Returns the inverse hyperbolic tangent.",
    category: "Hyperbolic",
  },

  // Exponential
  {
    name: "pow",
    signatures: genType2Sigs("pow"),
    description: "Returns x raised to the power y.",
    category: "Exponential",
  },
  {
    name: "exp",
    signatures: genTypeSigs("exp"),
    description: "Returns e raised to the power of x.",
    category: "Exponential",
  },
  {
    name: "log",
    signatures: genTypeSigs("log"),
    description: "Returns the natural logarithm of x.",
    category: "Exponential",
  },
  {
    name: "exp2",
    signatures: genTypeSigs("exp2"),
    description: "Returns 2 raised to the power of x.",
    category: "Exponential",
  },
  {
    name: "log2",
    signatures: genTypeSigs("log2"),
    description: "Returns the base-2 logarithm of x.",
    category: "Exponential",
  },
  {
    name: "sqrt",
    signatures: genTypeSigs("sqrt"),
    description: "Returns the square root of x.",
    category: "Exponential",
  },
  {
    name: "inversesqrt",
    signatures: genTypeSigs("inversesqrt"),
    description: "Returns 1 / sqrt(x).",
    category: "Exponential",
  },

  // Common
  {
    name: "abs",
    signatures: genTypeSigs("abs"),
    description: "Returns the absolute value of x.",
    category: "Common",
  },
  {
    name: "sign",
    signatures: genTypeSigs("sign"),
    description: "Returns -1.0, 0.0, or 1.0 depending on the sign of x.",
    category: "Common",
  },
  {
    name: "floor",
    signatures: genTypeSigs("floor"),
    description: "Returns the largest integer not greater than x.",
    category: "Common",
  },
  {
    name: "trunc",
    signatures: genTypeSigs("trunc"),
    description: "Returns the integer part of x (truncation toward zero).",
    category: "Common",
  },
  {
    name: "round",
    signatures: genTypeSigs("round"),
    description: "Returns the nearest integer to x.",
    category: "Common",
  },
  {
    name: "roundEven",
    signatures: genTypeSigs("roundEven"),
    description:
      "Returns the nearest integer to x; 0.5 rounds to the nearest even integer.",
    category: "Common",
  },
  {
    name: "ceil",
    signatures: genTypeSigs("ceil"),
    description: "Returns the smallest integer not less than x.",
    category: "Common",
  },
  {
    name: "fract",
    signatures: genTypeSigs("fract"),
    description: "Returns x - floor(x).",
    category: "Common",
  },
  {
    name: "mod",
    signatures: [
      ...genType2Sigs("mod"),
      ...["vec2", "vec3", "vec4"].map((t) => ({
        label: `${t} mod(${t} x, float y)`,
        parameters: [{ label: `${t} x` }, { label: "float y" }],
      })),
    ],
    description: "Returns x - y * floor(x/y).",
    category: "Common",
  },
  {
    name: "min",
    signatures: [
      ...genType2Sigs("min"),
      ...["vec2", "vec3", "vec4"].map((t) => ({
        label: `${t} min(${t} x, float y)`,
        parameters: [{ label: `${t} x` }, { label: "float y" }],
      })),
    ],
    description: "Returns the minimum of x and y.",
    category: "Common",
  },
  {
    name: "max",
    signatures: [
      ...genType2Sigs("max"),
      ...["vec2", "vec3", "vec4"].map((t) => ({
        label: `${t} max(${t} x, float y)`,
        parameters: [{ label: `${t} x` }, { label: "float y" }],
      })),
    ],
    description: "Returns the maximum of x and y.",
    category: "Common",
  },
  {
    name: "clamp",
    signatures: [
      ...genType3Sigs("clamp"),
      ...["vec2", "vec3", "vec4"].map((t) => ({
        label: `${t} clamp(${t} x, float minVal, float maxVal)`,
        parameters: [
          { label: `${t} x` },
          { label: "float minVal" },
          { label: "float maxVal" },
        ],
      })),
    ],
    description: "Clamps x to the range [minVal, maxVal].",
    category: "Common",
  },
  {
    name: "mix",
    signatures: [
      ...genType3Sigs("mix"),
      ...["vec2", "vec3", "vec4"].map((t) => ({
        label: `${t} mix(${t} x, ${t} y, float a)`,
        parameters: [
          { label: `${t} x` },
          { label: `${t} y` },
          { label: "float a" },
        ],
      })),
    ],
    description: "Linear interpolation between x and y using a.",
    category: "Common",
  },
  {
    name: "step",
    signatures: [
      ...genType2Sigs("step"),
      ...["vec2", "vec3", "vec4"].map((t) => ({
        label: `${t} step(float edge, ${t} x)`,
        parameters: [{ label: "float edge" }, { label: `${t} x` }],
      })),
    ],
    description: "Returns 0.0 if x < edge, otherwise 1.0.",
    category: "Common",
  },
  {
    name: "smoothstep",
    signatures: [
      ...["float", "vec2", "vec3", "vec4"].map((t) => ({
        label: `${t} smoothstep(${t} edge0, ${t} edge1, ${t} x)`,
        parameters: [
          { label: `${t} edge0` },
          { label: `${t} edge1` },
          { label: `${t} x` },
        ],
      })),
      ...["vec2", "vec3", "vec4"].map((t) => ({
        label: `${t} smoothstep(float edge0, float edge1, ${t} x)`,
        parameters: [
          { label: "float edge0" },
          { label: "float edge1" },
          { label: `${t} x` },
        ],
      })),
    ],
    description:
      "Performs Hermite interpolation between 0 and 1 when edge0 < x < edge1.",
    category: "Common",
  },
  {
    name: "isnan",
    signatures: genTypeSigs("isnan"),
    description: "Returns true if x is NaN.",
    category: "Common",
  },
  {
    name: "isinf",
    signatures: genTypeSigs("isinf"),
    description: "Returns true if x is positive or negative infinity.",
    category: "Common",
  },

  // Geometric
  {
    name: "length",
    signatures: genTypeSigs("length"),
    description: "Returns the length (magnitude) of the vector.",
    category: "Geometric",
  },
  {
    name: "distance",
    signatures: genType2Sigs("distance"),
    description: "Returns the distance between two points.",
    category: "Geometric",
  },
  {
    name: "dot",
    signatures: genType2Sigs("dot"),
    description: "Returns the dot product of two vectors.",
    category: "Geometric",
  },
  {
    name: "cross",
    signatures: [
      {
        label: "vec3 cross(vec3 x, vec3 y)",
        parameters: [{ label: "vec3 x" }, { label: "vec3 y" }],
      },
    ],
    description: "Returns the cross product of two 3-component vectors.",
    category: "Geometric",
  },
  {
    name: "normalize",
    signatures: genTypeSigs("normalize"),
    description: "Returns a unit vector in the same direction as x.",
    category: "Geometric",
  },
  {
    name: "faceforward",
    signatures: genType3Sigs("faceforward"),
    description: "Returns N if dot(Nref, I) < 0, otherwise returns -N.",
    category: "Geometric",
  },
  {
    name: "reflect",
    signatures: genType2Sigs("reflect"),
    description: "Reflects the incident vector I using the normal N.",
    category: "Geometric",
  },
  {
    name: "refract",
    signatures: ["float", "vec2", "vec3", "vec4"].map((t) => ({
      label: `${t} refract(${t} I, ${t} N, float eta)`,
      parameters: [
        { label: `${t} I` },
        { label: `${t} N` },
        { label: "float eta" },
      ],
    })),
    description:
      "Computes the refraction vector using the ratio of indices eta.",
    category: "Geometric",
  },

  // Matrix
  {
    name: "matrixCompMult",
    signatures: ["mat2", "mat3", "mat4"].map((t) => ({
      label: `${t} matrixCompMult(${t} x, ${t} y)`,
      parameters: [{ label: `${t} x` }, { label: `${t} y` }],
    })),
    description: "Component-wise multiplication of two matrices.",
    category: "Matrix",
  },
  {
    name: "outerProduct",
    signatures: [
      {
        label: "mat2 outerProduct(vec2 c, vec2 r)",
        parameters: [{ label: "vec2 c" }, { label: "vec2 r" }],
      },
      {
        label: "mat3 outerProduct(vec3 c, vec3 r)",
        parameters: [{ label: "vec3 c" }, { label: "vec3 r" }],
      },
      {
        label: "mat4 outerProduct(vec4 c, vec4 r)",
        parameters: [{ label: "vec4 c" }, { label: "vec4 r" }],
      },
    ],
    description: "Returns the outer product of two vectors.",
    category: "Matrix",
  },
  {
    name: "transpose",
    signatures: ["mat2", "mat3", "mat4"].map((t) => ({
      label: `${t} transpose(${t} m)`,
      parameters: [{ label: `${t} m` }],
    })),
    description: "Returns the transpose of the matrix.",
    category: "Matrix",
  },
  {
    name: "determinant",
    signatures: ["mat2", "mat3", "mat4"].map((t) => ({
      label: `float determinant(${t} m)`,
      parameters: [{ label: `${t} m` }],
    })),
    description: "Returns the determinant of the matrix.",
    category: "Matrix",
  },
  {
    name: "inverse",
    signatures: ["mat2", "mat3", "mat4"].map((t) => ({
      label: `${t} inverse(${t} m)`,
      parameters: [{ label: `${t} m` }],
    })),
    description: "Returns the inverse of the matrix.",
    category: "Matrix",
  },

  // Texture
  {
    name: "texture",
    signatures: [
      {
        label: "vec4 texture(sampler2D sampler, vec2 coord)",
        parameters: [{ label: "sampler2D sampler" }, { label: "vec2 coord" }],
      },
      {
        label: "vec4 texture(sampler3D sampler, vec3 coord)",
        parameters: [{ label: "sampler3D sampler" }, { label: "vec3 coord" }],
      },
      {
        label: "vec4 texture(samplerCube sampler, vec3 coord)",
        parameters: [{ label: "samplerCube sampler" }, { label: "vec3 coord" }],
      },
      {
        label: "vec4 texture(sampler2D sampler, vec2 coord, float bias)",
        parameters: [
          { label: "sampler2D sampler" },
          { label: "vec2 coord" },
          { label: "float bias" },
        ],
      },
    ],
    description: "Samples a texel from a texture.",
    category: "Texture",
  },
  {
    name: "textureSize",
    signatures: [
      {
        label: "ivec2 textureSize(sampler2D sampler, int lod)",
        parameters: [{ label: "sampler2D sampler" }, { label: "int lod" }],
      },
      {
        label: "ivec3 textureSize(sampler3D sampler, int lod)",
        parameters: [{ label: "sampler3D sampler" }, { label: "int lod" }],
      },
    ],
    description: "Returns the dimensions of the texture at the given LOD.",
    category: "Texture",
  },
  {
    name: "texelFetch",
    signatures: [
      {
        label: "vec4 texelFetch(sampler2D sampler, ivec2 coord, int lod)",
        parameters: [
          { label: "sampler2D sampler" },
          { label: "ivec2 coord" },
          { label: "int lod" },
        ],
      },
      {
        label: "vec4 texelFetch(sampler3D sampler, ivec3 coord, int lod)",
        parameters: [
          { label: "sampler3D sampler" },
          { label: "ivec3 coord" },
          { label: "int lod" },
        ],
      },
    ],
    description: "Fetches a single texel from the texture without filtering.",
    category: "Texture",
  },
  {
    name: "textureLod",
    signatures: [
      {
        label: "vec4 textureLod(sampler2D sampler, vec2 coord, float lod)",
        parameters: [
          { label: "sampler2D sampler" },
          { label: "vec2 coord" },
          { label: "float lod" },
        ],
      },
      {
        label: "vec4 textureLod(sampler3D sampler, vec3 coord, float lod)",
        parameters: [
          { label: "sampler3D sampler" },
          { label: "vec3 coord" },
          { label: "float lod" },
        ],
      },
    ],
    description: "Samples a texture with an explicit LOD.",
    category: "Texture",
  },
  {
    name: "textureProj",
    signatures: [
      {
        label: "vec4 textureProj(sampler2D sampler, vec3 coord)",
        parameters: [{ label: "sampler2D sampler" }, { label: "vec3 coord" }],
      },
      {
        label: "vec4 textureProj(sampler2D sampler, vec4 coord)",
        parameters: [{ label: "sampler2D sampler" }, { label: "vec4 coord" }],
      },
    ],
    description: "Performs a projective texture lookup.",
    category: "Texture",
  },
  {
    name: "textureGrad",
    signatures: [
      {
        label:
          "vec4 textureGrad(sampler2D sampler, vec2 coord, vec2 dPdx, vec2 dPdy)",
        parameters: [
          { label: "sampler2D sampler" },
          { label: "vec2 coord" },
          { label: "vec2 dPdx" },
          { label: "vec2 dPdy" },
        ],
      },
      {
        label:
          "vec4 textureGrad(sampler3D sampler, vec3 coord, vec3 dPdx, vec3 dPdy)",
        parameters: [
          { label: "sampler3D sampler" },
          { label: "vec3 coord" },
          { label: "vec3 dPdx" },
          { label: "vec3 dPdy" },
        ],
      },
    ],
    description: "Samples a texture with explicit gradients.",
    category: "Texture",
  },

  // Derivative
  {
    name: "dFdx",
    signatures: genTypeSigs("dFdx"),
    description:
      "Returns the partial derivative of the argument with respect to the window x coordinate.",
    category: "Derivative",
  },
  {
    name: "dFdy",
    signatures: genTypeSigs("dFdy"),
    description:
      "Returns the partial derivative of the argument with respect to the window y coordinate.",
    category: "Derivative",
  },
  {
    name: "fwidth",
    signatures: genTypeSigs("fwidth"),
    description: "Returns abs(dFdx(x)) + abs(dFdy(x)).",
    category: "Derivative",
  },
];

// ---- Types ----

const scalarTypes = ["void", "bool", "int", "uint", "float"];
const vecTypes = [
  "vec2",
  "vec3",
  "vec4",
  "ivec2",
  "ivec3",
  "ivec4",
  "uvec2",
  "uvec3",
  "uvec4",
  "bvec2",
  "bvec3",
  "bvec4",
];
const matTypes = [
  "mat2",
  "mat3",
  "mat4",
  "mat2x2",
  "mat2x3",
  "mat2x4",
  "mat3x2",
  "mat3x3",
  "mat3x4",
  "mat4x2",
  "mat4x3",
  "mat4x4",
];
const samplerTypes = [
  "sampler2D",
  "sampler3D",
  "samplerCube",
  "sampler2DShadow",
  "samplerCubeShadow",
  "sampler2DArray",
  "sampler2DArrayShadow",
  "isampler2D",
  "isampler3D",
  "isamplerCube",
  "isampler2DArray",
  "usampler2D",
  "usampler3D",
  "usamplerCube",
  "usampler2DArray",
];

function describeType(name: string): string {
  if (scalarTypes.includes(name)) return `GLSL scalar type \`${name}\`.`;
  if (name.startsWith("bvec"))
    return `GLSL ${name[4]}-component boolean vector.`;
  if (name.startsWith("ivec"))
    return `GLSL ${name[4]}-component integer vector.`;
  if (name.startsWith("uvec"))
    return `GLSL ${name[4]}-component unsigned integer vector.`;
  if (name.startsWith("vec")) return `GLSL ${name[3]}-component float vector.`;
  if (name.startsWith("mat") && name.includes("x")) {
    const parts = name.slice(3).split("x");
    return `GLSL ${parts[0]}x${parts[1]} float matrix.`;
  }
  if (name.startsWith("mat")) return `GLSL ${name[3]}x${name[3]} float matrix.`;
  if (name.includes("sampler") || name.includes("Sampler"))
    return `GLSL sampler type for texture access.`;
  return `GLSL type \`${name}\`.`;
}

export const GLSL_TYPES: GlslType[] = [
  ...scalarTypes,
  ...vecTypes,
  ...matTypes,
  ...samplerTypes,
].map((name) => ({ name, description: describeType(name) }));

// ---- Built-in Variables ----

export const GLSL_BUILTIN_VARIABLES: GlslBuiltinVariable[] = [
  {
    name: "gl_FragCoord",
    type: "vec4",
    description:
      "Window-relative coordinates of the current fragment. `xy` contains pixel position, `z` contains depth.",
  },
  {
    name: "gl_FrontFacing",
    type: "bool",
    description: "True if the fragment belongs to a front-facing primitive.",
  },
  {
    name: "gl_PointCoord",
    type: "vec2",
    description: "Fragment coordinate within a point primitive, range [0, 1].",
  },
  {
    name: "gl_FragDepth",
    type: "float",
    description:
      "Write-only output for the depth of the fragment. Overrides the fixed-function depth.",
  },
  {
    name: "gl_Position",
    type: "vec4",
    description:
      "Output clip-space position of the current vertex (vertex shader).",
  },
  {
    name: "gl_VertexID",
    type: "int",
    description: "Index of the current vertex being processed.",
  },
  {
    name: "gl_InstanceID",
    type: "int",
    description:
      "Index of the current instance when using instanced rendering.",
  },
];

// ---- Uniforms (project-specific) ----

export const GLSL_UNIFORMS: GlslUniform[] = [
  {
    name: "u_time",
    type: "float",
    description: "Elapsed time in seconds (from `performance.now() / 1000`).",
  },
  {
    name: "u_resolution",
    type: "vec2",
    description:
      "Canvas resolution in pixels (width, height), scaled by device pixel ratio.",
  },
  {
    name: "u_mouse",
    type: "vec2",
    description:
      "Mouse position in pixels. Origin is bottom-left (Y is flipped).",
  },
];

// ---- Keywords ----

export const GLSL_KEYWORDS: GlslKeyword[] = [
  { name: "if", description: "Conditional branching." },
  { name: "else", description: "Alternative branch for `if`." },
  { name: "for", description: "Loop with counter." },
  { name: "while", description: "Loop with condition." },
  { name: "do", description: "Do-while loop." },
  { name: "switch", description: "Multi-way branching." },
  { name: "case", description: "Branch label in a `switch` statement." },
  { name: "default", description: "Default branch in a `switch` statement." },
  { name: "break", description: "Exit the current loop or switch." },
  { name: "continue", description: "Skip to the next loop iteration." },
  { name: "return", description: "Return a value from the current function." },
  {
    name: "discard",
    description: "Discard the current fragment (fragment shader only).",
  },
  { name: "const", description: "Compile-time constant qualifier." },
  {
    name: "uniform",
    description:
      "Variable set by the application, constant across a draw call.",
  },
  { name: "in", description: "Input variable qualifier." },
  { name: "out", description: "Output variable qualifier." },
  { name: "inout", description: "Input/output parameter qualifier." },
  {
    name: "attribute",
    description: "Vertex attribute (GLSL ES 1.0 compatibility).",
  },
  {
    name: "varying",
    description: "Interpolated variable (GLSL ES 1.0 compatibility).",
  },
  { name: "precision", description: "Set the default precision for a type." },
  { name: "highp", description: "High precision qualifier." },
  { name: "mediump", description: "Medium precision qualifier." },
  { name: "lowp", description: "Low precision qualifier." },
  { name: "struct", description: "Define a composite type." },
  { name: "layout", description: "Layout qualifier for in/out variables." },
  { name: "flat", description: "Disable interpolation." },
  {
    name: "smooth",
    description: "Enable smooth (perspective-correct) interpolation.",
  },
  { name: "centroid", description: "Centroid-based interpolation qualifier." },
  { name: "true", description: "Boolean literal `true`." },
  { name: "false", description: "Boolean literal `false`." },
];

// ---- Snippets ----

export const GLSL_SNIPPETS: GlslSnippet[] = [
  {
    label: "main",
    insertText: "void main() {\n\t$0\n}",
    description: "Main function template.",
  },
  {
    label: "forloop",
    insertText: "for (int ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n\t$0\n}",
    description: "For loop.",
  },
  {
    label: "uv",
    insertText: "vec2 uv = gl_FragCoord.xy / u_resolution;",
    description: "Normalized UV coordinates (0 to 1).",
  },
  {
    label: "uv_centered",
    insertText:
      "vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);",
    description: "Centered UV coordinates (-1 to 1, aspect corrected).",
  },
  {
    label: "sdf_circle",
    insertText: "float d = length(${1:p}) - ${2:0.5};",
    description: "SDF circle.",
  },
  {
    label: "sdf_box",
    insertText:
      "vec2 d = abs(${1:p}) - ${2:vec2(0.5)};\nfloat sdf = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);",
    description: "SDF box.",
  },
  {
    label: "version",
    insertText: "#version 300 es\nprecision highp float;",
    description: "GLSL ES 3.0 version header.",
  },
  {
    label: "fragcolor",
    insertText:
      "out vec4 fragColor;\n\nvoid main() {\n\t$0\n\tfragColor = vec4(1.0);\n}",
    description: "Fragment shader output boilerplate.",
  },
];

// ---- Lookup Maps ----

export const GLSL_FUNCTION_MAP = new Map<string, GlslFunction>();
for (const fn of GLSL_FUNCTIONS) {
  GLSL_FUNCTION_MAP.set(fn.name, fn);
}

export const GLSL_TYPE_MAP = new Map<string, GlslType>();
for (const t of GLSL_TYPES) {
  GLSL_TYPE_MAP.set(t.name, t);
}

export const GLSL_BUILTIN_VARIABLE_MAP = new Map<string, GlslBuiltinVariable>();
for (const v of GLSL_BUILTIN_VARIABLES) {
  GLSL_BUILTIN_VARIABLE_MAP.set(v.name, v);
}

export const GLSL_UNIFORM_MAP = new Map<string, GlslUniform>();
for (const u of GLSL_UNIFORMS) {
  GLSL_UNIFORM_MAP.set(u.name, u);
}

export const GLSL_KEYWORD_MAP = new Map<string, GlslKeyword>();
for (const k of GLSL_KEYWORDS) {
  GLSL_KEYWORD_MAP.set(k.name, k);
}
