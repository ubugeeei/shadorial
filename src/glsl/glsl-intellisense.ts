import {
  GLSL_FUNCTIONS,
  GLSL_TYPES,
  GLSL_BUILTIN_VARIABLES,
  GLSL_UNIFORMS,
  GLSL_KEYWORDS,
  GLSL_SNIPPETS,
  GLSL_FUNCTION_MAP,
  GLSL_TYPE_MAP,
  GLSL_BUILTIN_VARIABLE_MAP,
  GLSL_UNIFORM_MAP,
  GLSL_KEYWORD_MAP,
} from "./glsl-data";

type Monaco = typeof import("monaco-editor");

// ---- Completion Provider ----

let cachedCompletionItems: any[] | null = null;

function buildCompletionItems(monaco: Monaco): any[] {
  if (cachedCompletionItems) return cachedCompletionItems;

  const items: any[] = [];

  for (const fn of GLSL_FUNCTIONS) {
    items.push({
      label: fn.name,
      kind: monaco.languages.CompletionItemKind.Function,
      detail: fn.signatures[0].label,
      documentation: {
        value: `**${fn.category}** — ${fn.description}`,
      },
      insertText: fn.name,
      sortText: "1_" + fn.name,
    });
  }

  for (const t of GLSL_TYPES) {
    items.push({
      label: t.name,
      kind: monaco.languages.CompletionItemKind.Class,
      detail: t.name,
      documentation: { value: t.description },
      insertText: t.name,
      sortText: "2_" + t.name,
    });
  }

  for (const v of GLSL_BUILTIN_VARIABLES) {
    items.push({
      label: v.name,
      kind: monaco.languages.CompletionItemKind.Variable,
      detail: v.type,
      documentation: { value: v.description },
      insertText: v.name,
      sortText: "3_" + v.name,
    });
  }

  for (const u of GLSL_UNIFORMS) {
    items.push({
      label: u.name,
      kind: monaco.languages.CompletionItemKind.Variable,
      detail: `uniform ${u.type}`,
      documentation: { value: u.description },
      insertText: u.name,
      sortText: "0_" + u.name,
    });
  }

  for (const k of GLSL_KEYWORDS) {
    items.push({
      label: k.name,
      kind: monaco.languages.CompletionItemKind.Keyword,
      detail: "keyword",
      documentation: { value: k.description },
      insertText: k.name,
      sortText: "4_" + k.name,
    });
  }

  for (const s of GLSL_SNIPPETS) {
    items.push({
      label: s.label,
      kind: monaco.languages.CompletionItemKind.Snippet,
      detail: s.description,
      documentation: { value: s.description },
      insertText: s.insertText,
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      sortText: "0_" + s.label,
    });
  }

  cachedCompletionItems = items;
  return items;
}

export function registerGlslCompletionProvider(monaco: Monaco): void {
  monaco.languages.registerCompletionItemProvider("glsl", {
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      const items = buildCompletionItems(monaco);
      return {
        suggestions: items.map((item) => ({ ...item, range })),
      };
    },
  });
}

// ---- Hover Provider ----

export function registerGlslHoverProvider(monaco: Monaco): void {
  monaco.languages.registerHoverProvider("glsl", {
    provideHover(model, position) {
      const wordInfo = model.getWordAtPosition(position);
      if (!wordInfo) return null;

      const word = wordInfo.word;
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: wordInfo.startColumn,
        endColumn: wordInfo.endColumn,
      };

      const fn = GLSL_FUNCTION_MAP.get(word);
      if (fn) {
        const sigs = fn.signatures
          .map((s) => "```glsl\n" + s.label + "\n```")
          .join("\n");
        return {
          range,
          contents: [
            {
              value: sigs + "\n\n**" + fn.category + "** — " + fn.description,
            },
          ],
        };
      }

      const builtin = GLSL_BUILTIN_VARIABLE_MAP.get(word);
      if (builtin) {
        return {
          range,
          contents: [
            {
              value:
                "```glsl\n" +
                builtin.type +
                " " +
                builtin.name +
                "\n```\n\n" +
                builtin.description,
            },
          ],
        };
      }

      const uni = GLSL_UNIFORM_MAP.get(word);
      if (uni) {
        return {
          range,
          contents: [
            {
              value:
                "```glsl\nuniform " +
                uni.type +
                " " +
                uni.name +
                "\n```\n\n" +
                uni.description,
            },
          ],
        };
      }

      const ty = GLSL_TYPE_MAP.get(word);
      if (ty) {
        return {
          range,
          contents: [{ value: ty.description }],
        };
      }

      const kw = GLSL_KEYWORD_MAP.get(word);
      if (kw) {
        return {
          range,
          contents: [{ value: kw.description }],
        };
      }

      return null;
    },
  });
}

// ---- Signature Help Provider ----

function findFunctionCall(
  model: any,
  position: any,
): { functionName: string; activeParameter: number } | null {
  const maxLinesBack = 20;
  const startLine = Math.max(1, position.lineNumber - maxLinesBack);
  let depth = 0;
  let commaCount = 0;

  for (let line = position.lineNumber; line >= startLine; line--) {
    const lineContent = model.getLineContent(line);
    const endCol =
      line === position.lineNumber ? position.column - 1 : lineContent.length;
    const startCol = 0;

    for (let col = endCol - 1; col >= startCol; col--) {
      const ch = lineContent[col];
      if (ch === ")") {
        depth++;
      } else if (ch === "(") {
        if (depth > 0) {
          depth--;
        } else {
          const before = lineContent.substring(0, col).trimEnd();
          const match = before.match(/([a-zA-Z_]\w*)$/);
          if (match) {
            return { functionName: match[1], activeParameter: commaCount };
          }
          return null;
        }
      } else if (ch === "," && depth === 0) {
        commaCount++;
      }
    }
  }
  return null;
}

export function registerGlslSignatureHelpProvider(monaco: Monaco): void {
  monaco.languages.registerSignatureHelpProvider("glsl", {
    signatureHelpTriggerCharacters: ["("],
    signatureHelpRetriggerCharacters: [","],
    provideSignatureHelp(model, position) {
      const call = findFunctionCall(model, position);
      if (!call) return null;

      const fn = GLSL_FUNCTION_MAP.get(call.functionName);
      if (!fn) return null;

      const signatures = fn.signatures.map((sig) => ({
        label: sig.label,
        documentation: { value: fn.description },
        parameters: sig.parameters.map((p) => ({
          label: p.label,
          documentation: p.documentation || "",
        })),
      }));

      let activeSignature = 0;
      for (let i = 0; i < signatures.length; i++) {
        if (signatures[i].parameters.length > call.activeParameter) {
          activeSignature = i;
          break;
        }
      }

      return {
        value: {
          signatures,
          activeSignature,
          activeParameter: call.activeParameter,
        },
        dispose() {},
      };
    },
  });
}
