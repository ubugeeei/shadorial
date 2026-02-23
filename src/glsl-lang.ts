import {
  registerGlslCompletionProvider,
  registerGlslHoverProvider,
  registerGlslSignatureHelpProvider,
} from "./glsl/glsl-intellisense";

export function registerGlsl(monaco: any) {
  monaco.languages.register({ id: "glsl" });
  monaco.languages.setMonarchTokensProvider("glsl", {
    keywords: [
      "attribute", "const", "uniform", "varying", "layout",
      "centroid", "flat", "smooth", "noperspective",
      "break", "continue", "do", "for", "while", "switch", "case", "default",
      "if", "else", "in", "out", "inout",
      "float", "int", "uint", "void", "bool",
      "true", "false",
      "discard", "return", "struct",
      "vec2", "vec3", "vec4", "ivec2", "ivec3", "ivec4",
      "uvec2", "uvec3", "uvec4", "bvec2", "bvec3", "bvec4",
      "mat2", "mat3", "mat4", "mat2x2", "mat2x3", "mat2x4",
      "mat3x2", "mat3x3", "mat3x4", "mat4x2", "mat4x3", "mat4x4",
      "sampler2D", "sampler3D", "samplerCube",
      "sampler2DShadow", "samplerCubeShadow",
      "sampler2DArray", "sampler2DArrayShadow",
      "isampler2D", "isampler3D", "isamplerCube", "isampler2DArray",
      "usampler2D", "usampler3D", "usamplerCube", "usampler2DArray",
      "precision", "highp", "mediump", "lowp",
    ],
    builtins: [
      "radians", "degrees", "sin", "cos", "tan", "asin", "acos", "atan",
      "sinh", "cosh", "tanh", "asinh", "acosh", "atanh",
      "pow", "exp", "log", "exp2", "log2", "sqrt", "inversesqrt",
      "abs", "sign", "floor", "trunc", "round", "roundEven", "ceil", "fract",
      "mod", "min", "max", "clamp", "mix", "step", "smoothstep",
      "length", "distance", "dot", "cross", "normalize", "faceforward",
      "reflect", "refract", "texture", "textureSize", "texelFetch",
      "dFdx", "dFdy", "fwidth",
      "gl_FragCoord", "gl_FragColor", "gl_Position",
    ],
    tokenizer: {
      root: [
        [/#\s*\w+/, "keyword.directive"],
        [/\/\/.*$/, "comment"],
        [/\/\*/, "comment", "@comment"],
        [/\d+\.\d*([eE][-+]?\d+)?/, "number.float"],
        [/\.\d+([eE][-+]?\d+)?/, "number.float"],
        [/\d+[eE][-+]?\d+/, "number.float"],
        [/0[xX][0-9a-fA-F]+[uU]?/, "number.hex"],
        [/\d+[uU]?/, "number"],
        [/[a-zA-Z_]\w*/, {
          cases: {
            "@keywords": "keyword",
            "@builtins": "type.identifier",
            "@default": "identifier",
          },
        }],
        [/[{}()[\]]/, "@brackets"],
        [/[;,.]/, "delimiter"],
        [/[+\-*/=<>!&|^~?:%]+/, "operator"],
      ],
      comment: [
        [/[^/*]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[/*]/, "comment"],
      ],
    },
  });

  registerGlslCompletionProvider(monaco);
  registerGlslHoverProvider(monaco);
  registerGlslSignatureHelpProvider(monaco);
}
